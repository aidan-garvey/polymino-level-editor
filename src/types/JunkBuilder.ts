import type { JunkEffect } from './JunkEffect'
import { CellGrid } from '@/types/CellGrid'
import { Junk } from '@/types/Junk'
import { JunkShape } from '@/types/JunkShape'
import { BlockColor } from '@/types/BlockColor'
import { junkShapeDimensions } from '@/consts/junk'

export class JunkBuilder {
  readonly grid: ShallowRef<CellGrid> = shallowRef(new CellGrid(1, 1, true))
  private readonly selectedShape: Ref<JunkShape> = ref(JunkShape.RECT_3X3)
  private readonly selectedColor: Ref<BlockColor> = ref(BlockColor.GRAY)
  private readonly selectedEffect: Ref<JunkEffect | null> = ref(null)

  constructor() {
    this.setJunkShape(this.selectedShape.value)
  }

  setJunkShape(shape: JunkShape): void {
    this.selectedShape.value = shape
    this.grid.value = new CellGrid(...junkShapeDimensions[shape], true)
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
}
