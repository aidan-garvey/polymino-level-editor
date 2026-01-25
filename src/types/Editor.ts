import type { JunkEffect } from '@/types/JunkEffect'
import { type Tool, ToolKind } from '@/types/Tool'
import { BaseLayer } from '@/types/layers/BaseLayer'
import { BrushLayer } from '@/types/layers/BrushLayer'
import { JunkLayer } from '@/types/layers/JunkLayer'
import { JunkBuilder } from '@/types/JunkBuilder'
import { BlockState } from '@/types/BlockState'
import { BlockColor } from '@/types/BlockColor'
import { MouseButton } from '@/consts/mouse'

export class Editor {
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

  /**
   * All players' random generators will be initalized to this value when the
   * level is loaded, ensuring the same sequence of actions in a puzzle level
   * will always have the same results. As far as the level editor is concerned,
   * it's just a number that doesn't affect anything.
   */
  seed: number

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

  constructor() {
    this.baseLayer = new BaseLayer()
    this.brushLayer = new BrushLayer()
    this.junkLayer = new JunkLayer()
    this.junkBuilder = new JunkBuilder()
    this.seed = Math.round(performance.now())
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
      event.preventDefault()
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
      event.preventDefault()
      select(this.leftTool)
    }
    if (event.buttons & MouseButton.RIGHT) {
      event.preventDefault()
      select(this.rightTool)
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

  onCellPointerDown(event: PointerEvent, row: number, col: number): void {
    const useTool = (tool: Ref<Tool>) => {
      switch (tool.value.kind) {
        case ToolKind.SELECT:
          // TODO: If there's a junk piece on the cell, select it
          break
        case ToolKind.BRUSH:
          this.brushLayer.applyBrush(tool.value, row, col)
          break
      }
    }

    if (event.buttons & MouseButton.LEFT) {
      event.preventDefault()
      useTool(this.leftTool)
    }
    if (event.buttons & MouseButton.RIGHT) {
      event.preventDefault()
      useTool(this.rightTool)
    }
  }

  onCellPointerEnter(event: PointerEvent, row: number, col: number): void {
    const useTool = (tool: Ref<Tool>) => {
      if (tool.value.kind === ToolKind.BRUSH) {
        this.brushLayer.applyBrush(tool.value, row, col)
      }
    }

    if (event.buttons & MouseButton.LEFT) {
      event.preventDefault()
      useTool(this.leftTool)
    }
    if (event.buttons & MouseButton.RIGHT) {
      event.preventDefault()
      useTool(this.rightTool)
    }
  }
}
