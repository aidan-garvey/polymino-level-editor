import { BlockState } from '@/types/BlockState'
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

/**
 * Covers the valid tool states that can be used to paint in nextColor mode.
 */
export interface NextColorBrush {
  kind: ToolKind.BRUSH
  brushState: BlockState.NORMAL
  brushColor: BlockColor
  // brushEffect has no effect when using non-junk brushes, and the editor
  // deliberately leaves it as-is when selecting a non-junk brush for UX
  // reasons, so we allow any brushEffect tools which paint nextColor.
  brushEffect: JunkEffect | null
}

export const isNextColorBrush = (tool: Tool): tool is NextColorBrush => {
  return tool.kind === ToolKind.BRUSH
    && tool.brushState === BlockState.NORMAL
    && tool.brushColor !== null
}
