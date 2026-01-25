import type { JunkEffect } from './JunkEffect'
import type { JunkDragData, JunkDragFormat } from '@/types/JunkDrag'
import { CellGrid } from '@/types/CellGrid'
import { Junk } from '@/types/Junk'
import { JunkShape } from '@/types/JunkShape'
import { BlockColor } from '@/types/BlockColor'
import { junkShapeDimensions } from '@/consts/junk'

export class JunkBuilder {
  readonly grid: ShallowRef<CellGrid> = shallowRef(new CellGrid(1, 1))
  private readonly selectedShape: Ref<JunkShape> = ref(JunkShape.RECT_3X3)
  private readonly selectedColor: Ref<BlockColor> = ref(BlockColor.GRAY)
  private readonly selectedEffect: Ref<JunkEffect | null> = ref(null)

  constructor() {
    this.setJunkShape(this.selectedShape.value)
  }

  setJunkShape(shape: JunkShape): void {
    this.selectedShape.value = shape
    this.grid.value = new CellGrid(...junkShapeDimensions[shape])
    this.grid.value.placeJunk(new Junk(
      shape,
      this.selectedColor.value,
      0,
      0,
      this.selectedEffect.value
    ))
  }

  getJunkShape(): JunkShape {
    return this.selectedShape.value
  }

  setColor(color: BlockColor): void {
    this.selectedColor.value = color
    for (const junk of this.grid.value.getJunk()) {
      junk.color = color
    }
  }

  getColor(): BlockColor {
    return this.selectedColor.value
  }

  setEffect(effect: JunkEffect | null): void {
    this.selectedEffect.value = effect
    for (const junk of this.grid.value.getJunk()) {
      junk.activeEffect = effect
    }
  }

  getEffect(): JunkEffect | null {
    return this.selectedEffect.value
  }

  setDragData(event: DragEvent): void {
    const [width, height] = junkShapeDimensions[this.selectedShape.value]
    const format: JunkDragFormat = `pdx/junk:${width}:${height}`
    const data: JunkDragData = {
      shape: this.selectedShape.value,
      color: this.selectedColor.value,
      effect: this.selectedEffect.value
    }
    event.dataTransfer?.setData(format, JSON.stringify(data))
  }
}
