import type { JunkEffect } from '@/types/JunkEffect'
import type { Junk } from '@/types/Junk'
import type { SavedLevel } from '@/types/Saved/SavedLevel'
import type { ExportedLevel } from '@/types/Exported/ExportedLevel'
import { type Tool, ToolKind } from '@/types/Tool'
import { CellGrid } from '@/types/CellGrid'
import { BaseLayer } from '@/types/Layer/BaseLayer'
import { BrushLayer } from '@/types/Layer/BrushLayer'
import { JunkLayer } from '@/types/Layer/JunkLayer'
import { JunkBuilder } from '@/types/JunkBuilder'
import { BlockState } from '@/types/BlockState'
import { BlockColor } from '@/types/BlockColor'
import { MouseButton } from '@/consts/mouse'
import { History } from '@/types/History/History'
import { BOARD_WIDTH, BOARD_HEIGHT } from '@/consts/board'

export class Editor {
  readonly history: History

  /**
   * The base layer is full of random blocks which serves as a good starting
   * point for filling in parts of the level. Its random seed is not related to
   * the Editor's seed, which is the one used by Polymino for any subsequent RNG
   * calls after the level is initialized.
   */
  readonly baseLayer: BaseLayer

  readonly brushLayer: BrushLayer

  readonly junkLayer: JunkLayer

  readonly junkBuilder: JunkBuilder

  readonly selectedJunk: ShallowRef<Junk | null> = shallowRef(null)

  readonly levelName: Ref<string> = ref('Untitled')

  /**
   * All players' random generators will be initalized to this value when the
   * level is loaded, ensuring the same sequence of actions in a puzzle level
   * will always have the same results. As far as the level editor is concerned,
   * it's just a number that doesn't affect anything.
   */
  readonly seed: Ref<number>

  /**
   * State of the tool selected on the left mouse button
   */
  readonly leftTool = ref<Tool>({
    kind: ToolKind.SELECT,
    brushState: null,
    brushColor: null,
    brushEffect: null,
  })

  /**
   * State of the tool selected on the right mouse button
   */
  readonly rightTool = ref<Tool>({
    kind: ToolKind.SELECT,
    brushState: null,
    brushColor: null,
    brushEffect: null,
  })

  /**
   * When a drop event occurs, if a different element is at the location where
   * the drag operation began, a pointerenter event is fired on the new element
   * before the mouse's state starts being tracked again. So, if we drag a junk
   * piece around within the cell grid, and the cell at the starting position
   * isn't still covered by the junk piece after we drop it, a pointerenter
   * event will fire on the now-revealed cell, and the mouse button will still
   * be held down (which will apply a brush if selected).
   *
   * To work around this, this flag is set to true when a drag operation starts;
   * then, the next time we get a pointerenter event in the brush layer, we set
   * it to false and ignore the event.
   *
   * If the user drags a junk piece into a cell that already had a junk piece,
   * there won't be a pointerenter event, but that's OK because before the user
   * is able to start using another brush/tool, they'll need to move their
   * cursor to a different cell (clearing the flag) and then start their next
   * operation with a pointerdown event (which we'll handle normally).
   *
   * This is exposed as a reactive value so it can be used for contextual info
   * about dragging junk pieces.
   *
   * Thank you for coming to my TED Talk.
   */
  readonly isDragging = ref(false)

  readonly mouseCoordinates = ref<{ row: number, col: number } | null>(null)

  constructor(data?: SavedLevel) {
    // When a level is loaded or a new level is started, we create a new history
    // object, which resets the "unsaved changes" state.
    if (data) {
      this.levelName.value = data.name
      this.baseLayer = BaseLayer.fromSaved(data.baseLayer)
      this.brushLayer = new BrushLayer(
        CellGrid.fromExported(data.brushLayer, false)
      )
      this.junkLayer = new JunkLayer(
        CellGrid.fromExported(data.junkLayer, true)
      )
      this.junkBuilder = new JunkBuilder()
      this.seed = ref(data.seed)
      this.history = new History(this, false)
    } else {
      this.baseLayer = new BaseLayer()
      this.brushLayer = new BrushLayer()
      this.junkLayer = new JunkLayer()
      this.junkBuilder = new JunkBuilder()
      this.seed = ref(Math.round(performance.now()))
      this.history = new History(this, true)
    }
  }

  private saveState(): SavedLevel {
    return {
      name: this.levelName.value,
      baseLayer: this.baseLayer.save(),
      brushLayer: this.brushLayer.board.export(),
      junkLayer: this.junkLayer.board.export(),
      seed: this.seed.value,
      lastModified: (new Date).toISOString()
    }
  }

  /**
   * Save the level for the purposes of writing to local storage. Clears the
   * "unsaved changes" warning.
   */
  saveForLocalStorage(): SavedLevel {
    this.history.onLevelSaved()
    return this.saveState()
  }

  /**
   * Save the level for the purposes of saving to disk. May or may not clear the
   * "unsaved changes" warning, depending on if it's is considered to be
   * equivalent to saving to local storage.
   */
  saveForDownload(): SavedLevel {
    // Assume that downloading is a backup thing, and people will prefer local
    // storage. If they load a level from local storage and it isn't what they
    // remember saving (b/c they saved it to disk) they might not think to check
    // local storage for the right version of the file. I think the best thing
    // to do is still show the "unsaved changes" warnings.
    return this.saveState()
  }

  /**
   * Return the current editor state as a SavedLevel, without considering it as
   * the user actually saving the level.
   */
  saveForHistory(): SavedLevel {
    return this.saveState()
  }

  export(): ExportedLevel {
    const combinedGrid = new CellGrid(BOARD_WIDTH, BOARD_HEIGHT, false)
    this.baseLayer.board.overlayOnto(combinedGrid)
    this.brushLayer.board.overlayOnto(combinedGrid)
    this.junkLayer.board.overlayOnto(combinedGrid)
    return {
      ...combinedGrid.export(),
      name: this.levelName.value,
      seed: this.seed.value
    }
  }

  /**
   * Should only be called to load the given state for history-related reasons,
   * not file-loading operations. To open a file or start a new level, you
   * should re-construct the Editor.
   */
  jumpToHistory(level: SavedLevel): void {
    this.levelName.value = level.name
    this.baseLayer.restore(level.baseLayer)
    this.brushLayer.restore(level.brushLayer)
    this.junkLayer.restore(level.junkLayer)
    this.seed.value = level.seed

    if (this.selectedJunk.value) {
      if (!this.junkLayer.board.getJunkById(this.selectedJunk.value.id)) {
        this.deselectJunk()
      }
    }
  }

  selectBrush(
    event: PointerEvent,
    state: BlockState | null,
    color: BlockColor | null,
  ): void {
    if (state === BlockState.NORMAL && color === BlockColor.GRAY) {
      throw new Error('Cannot select gray normal block as brush')
    }

    const select = (tool: Ref<Tool>) => {
      tool.value.kind = ToolKind.BRUSH
      tool.value.brushState = state
      tool.value.brushColor = color
      // won't clear the effect to make the user's experience smoother, we'll
      // ignore it for non-junk brushes anyway
    }

    if (event.buttons & MouseButton.LEFT) {
      select(this.leftTool)
    }
    if (event.buttons & MouseButton.RIGHT) {
      event.preventDefault()
      select(this.rightTool)
    }
  }

  selectEffect(
    event: PointerEvent,
    effect: JunkEffect | null,
  ): void {
    const select = (tool: Ref<Tool>) => {
      tool.value.kind = ToolKind.BRUSH
      tool.value.brushState = BlockState.JUNK
      tool.value.brushEffect = effect
    }

    if (event.buttons & MouseButton.LEFT) {
      select(this.leftTool)
    }
    if (event.buttons & MouseButton.RIGHT) {
      event.preventDefault()
      select(this.rightTool)
    }
  }

  selectPicker(event: PointerEvent): void {
    if (event.buttons & MouseButton.LEFT) {
      this.leftTool.value.kind = ToolKind.PICKER
    }
    if (event.buttons & MouseButton.RIGHT) {
      event.preventDefault()
      this.rightTool.value.kind = ToolKind.PICKER
    }
  }

  chooseSelectTool(event: PointerEvent): void {
    if (event.buttons & MouseButton.LEFT) {
      this.leftTool.value.kind = ToolKind.SELECT
    }
    if (event.buttons & MouseButton.RIGHT) {
      this.rightTool.value.kind = ToolKind.SELECT
    }
  }

  brushCellPointerDown(event: PointerEvent, row: number, col: number): void {
    const useTool = (tool: Ref<Tool>, button: MouseButton) => {
      switch (tool.value.kind) {
        case ToolKind.SELECT:
          this.deselectJunk()
          break
        case ToolKind.BRUSH:
          // must call before applying brush so our 'before' state is correct
          this.history.startBrush(tool.value, button)
          this.brushLayer.applyBrush(tool.value, row, col)
          break
        case ToolKind.PICKER:
          this.pick(tool.value, row, col)
          break
      }
    }

    // Can only use one at a time, otherwise history tracking would get weird
    if (event.buttons & MouseButton.LEFT) {
      useTool(this.leftTool, MouseButton.LEFT)
    } else if (event.buttons & MouseButton.RIGHT) {
      event.preventDefault()
      useTool(this.rightTool, MouseButton.RIGHT)
    }
  }

  brushCellPointerEnter(event: PointerEvent, row: number, col: number): void {
    this.mouseCoordinates.value = { row, col }

    if (this.isDragging.value) {
      this.isDragging.value = false
      return
    }

    const useTool = (tool: Ref<Tool>, button: MouseButton) => {
      if (tool.value.kind === ToolKind.BRUSH) {
        // must call before applying brush so our 'before' state is correct
        this.history.continueBrush(tool.value, button)
        this.brushLayer.applyBrush(tool.value, row, col)
      }
    }

    // Can only use one at a time, otherwise history tracking would get weird
    if (event.buttons & MouseButton.LEFT) {
      useTool(this.leftTool, MouseButton.LEFT)
    } else if (event.buttons & MouseButton.RIGHT) {
      event.preventDefault()
      useTool(this.rightTool, MouseButton.RIGHT)
    }
  }

  junkCellPointerEnter(event: PointerEvent, row: number, col: number): void {
    void event
    this.mouseCoordinates.value = { row, col }
  }

  onCellPointerLeave(event: PointerEvent, row: number, col: number): void {
    void event
    const coords = this.mouseCoordinates.value
    // In case there's overlap and this happens after another cell updates the
    // position with a pointerenter event, we'll only clear this if it's in the
    // same coordinates that are currently set.
    if (coords && coords.row === row && coords.col === col) {
      this.mouseCoordinates.value = null
    }
  }

  onCellDrop(event: DragEvent, row: number, col: number): void {
    const before = this.saveForHistory()
    const numJunkBefore = this.junkLayer.board.getJunk().length

    const result = this.junkLayer.onCellDrop(event, row, col)
    if (result) {
      this.selectJunk(result)

      const numJunkNow = this.junkLayer.board.getJunk().length
      if (numJunkNow > numJunkBefore) {
        this.history.pushCopyJunk(before)
      } else {
        this.history.pushMoveJunk(before)
      }
    }
  }

  private pick(tool: Tool, row: number, col: number): void {
    const block = this.brushLayer.board.getBlock(row, col)
    if (block.state === BlockState.EMPTY) {
      return
    }

    tool.kind = ToolKind.BRUSH
    tool.brushState = block.state
    tool.brushColor = block.color
    tool.brushEffect = block.state === BlockState.JUNK
      ? block.junk.activeEffect
      : null
  }

  selectJunk(junk: Junk): void {
    this.selectedJunk.value = junk
  }

  deselectJunk(): void {
    this.selectedJunk.value = null
  }

  setSelectedJunkColor(color: BlockColor): void {
    if (this.selectedJunk.value) {
      const before = this.saveForHistory()
      this.selectedJunk.value.color = color
      this.history.pushEditJunk(before)
    }
  }

  setSelectedJunkEffect(effect: JunkEffect | null): void {
    if (this.selectedJunk.value) {
      const before = this.saveForHistory()
      this.selectedJunk.value.activeEffect = effect
      this.history.pushEditJunk(before)
    }
  }

  deleteSelectedJunk(): void {
    if (this.selectedJunk.value) {
      const before = this.saveForHistory()
      this.junkLayer.board.removeJunk(this.selectedJunk.value)
      this.deselectJunk()
      this.history.pushDeleteJunk(before)
    }
  }
}
