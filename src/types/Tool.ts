import type { BlockState } from '@/types/BlockState'
import type { BlockColor } from '@/types/BlockColor'
import type { JunkEffect } from '@/types/JunkEffect'

export enum ToolKind {
  SELECT = 'select',
  BRUSH = 'brush',
  PICKER = 'picker',
}

export interface Tool {
  kind: ToolKind
  brushState: BlockState | null
  brushColor: BlockColor | null
  brushEffect: JunkEffect | null
}
