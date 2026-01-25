import { JunkShape } from '@/types/JunkShape'
import { JunkBlockType } from '@/types/JunkBlockType'

const {
  EMPTY,
  CENTER,
  CORNER_IN_TL,
  CORNER_IN_TR,
  CORNER_IN_BL,
  CORNER_IN_BR,
  CORNER_OUT_TL,
  CORNER_OUT_TR,
  CORNER_OUT_BL,
  CORNER_OUT_BR,
  EDGE_TOP,
  EDGE_BOTTOM,
  EDGE_LEFT,
  EDGE_RIGHT,
  SINGLE,
  ROW_MID,
  ROW_LEFT,
  ROW_RIGHT,
} = JunkBlockType

export const junkShapeDimensions: Record<JunkShape, [number, number]> = {
  [JunkShape.RECT_2X3]:   [2, 3],
  [JunkShape.RECT_3X2]:   [3, 2],
  [JunkShape.RECT_3X3]:   [3, 3],
  [JunkShape.RECT_4X2]:   [4, 2],
  [JunkShape.BIG_L]:      [4, 3],
  [JunkShape.BIG_L_REV]:  [4, 3],
  [JunkShape.RECT_1X1]:   [1, 1],
  [JunkShape.RECT_2X1]:   [2, 1],
  [JunkShape.RECT_2X2]:   [2, 2],
  [JunkShape.RECT_4X4]:   [4, 4],
  [JunkShape.RECT_10X1]:  [10, 1],
}

export const junkShapeBlocks: Record<JunkShape, JunkBlockType[]> = {
  [JunkShape.RECT_2X3]: [
    CORNER_OUT_BL, CORNER_OUT_BR,
    EDGE_LEFT,     EDGE_RIGHT,
    CORNER_OUT_TL, CORNER_OUT_TR
  ],
  [JunkShape.RECT_3X2]: [
    CORNER_OUT_BL, EDGE_BOTTOM, CORNER_OUT_BR,
    CORNER_OUT_TL, EDGE_TOP,    CORNER_OUT_TR
  ],
  [JunkShape.RECT_3X3]: [
    CORNER_OUT_BL, EDGE_BOTTOM, CORNER_OUT_BR,
    EDGE_LEFT,     CENTER,      EDGE_RIGHT,
    CORNER_OUT_TL, EDGE_TOP,    CORNER_OUT_TR
  ],
  [JunkShape.RECT_4X2]: [
    CORNER_OUT_BL, EDGE_BOTTOM, EDGE_BOTTOM, CORNER_OUT_BR,
    CORNER_OUT_TL, EDGE_TOP,    EDGE_TOP,    CORNER_OUT_TR
  ],
  [JunkShape.BIG_L]: [
    CORNER_OUT_BL, EDGE_BOTTOM,   EDGE_BOTTOM, CORNER_OUT_BR,
    EDGE_LEFT,     CORNER_IN_TR,  EDGE_TOP,    CORNER_OUT_TR,
    CORNER_OUT_TL, CORNER_OUT_TR, EMPTY,       EMPTY
  ],
  [JunkShape.BIG_L_REV]: [
    CORNER_OUT_BL, EDGE_BOTTOM, EDGE_BOTTOM,   CORNER_OUT_BR,
    CORNER_OUT_TL, EDGE_TOP,    CORNER_IN_TL,  EDGE_RIGHT,
    EMPTY,         EMPTY,       CORNER_OUT_TL, CORNER_OUT_TR
  ],
  [JunkShape.RECT_1X1]: [
    SINGLE
  ],
  [JunkShape.RECT_2X1]: [
    ROW_LEFT, ROW_RIGHT
  ],
  [JunkShape.RECT_2X2]: [
    CORNER_OUT_BL, CORNER_OUT_BR,
    CORNER_OUT_TL, CORNER_OUT_TR
  ],
  [JunkShape.RECT_4X4]: [
    CORNER_OUT_BL, EDGE_BOTTOM, EDGE_BOTTOM, CORNER_OUT_BR,
    EDGE_LEFT,     CENTER,      CENTER,      EDGE_RIGHT,
    EDGE_LEFT,     CENTER,      CENTER,      EDGE_RIGHT,
    CORNER_OUT_TL, EDGE_TOP,    EDGE_TOP,    CORNER_OUT_TR
  ],
  [JunkShape.RECT_10X1]: [
    ROW_LEFT, ROW_MID, ROW_MID, ROW_MID, ROW_MID,
    ROW_MID,  ROW_MID, ROW_MID, ROW_MID, ROW_RIGHT
  ],
}

/**
 * Stores the horizontal and vertical (in that order) flip values for each
 * JunkBlockType.
 */
export const junkFlipMap: Record<JunkBlockType, [boolean, boolean]> = {
  [EMPTY]:         [false, false],
  [CENTER]:        [false, false],
  [CORNER_IN_TL]:  [true,  false],
  [CORNER_IN_TR]:  [false, false],
  [CORNER_IN_BL]:  [true,  true],
  [CORNER_IN_BR]:  [false, true],
  [CORNER_OUT_TL]: [false, false],
  [CORNER_OUT_TR]: [true,  false],
  [CORNER_OUT_BL]: [false, true],
  [CORNER_OUT_BR]: [true,  true],
  [EDGE_TOP]:      [false, false],
  [EDGE_BOTTOM]:   [false, true],
  [EDGE_LEFT]:     [false, false],
  [EDGE_RIGHT]:    [true,  false],
  [SINGLE]:        [false, false],
  [ROW_LEFT]:      [false, false],
  [ROW_MID]:       [false, false],
  [ROW_RIGHT]:     [true,  false],
}

/**
 * Maps JunkBlockTypes to the suffix in its image's filename.
 * The full path is `assets/junk/${colorName}${suffix}.png`
 */
export const junkBlockPathSuffixes: Record<JunkBlockType, string> = {
  [EMPTY]:         '',
  [CENTER]:        'Center',
  [CORNER_IN_TL]:  'CornerIn',
  [CORNER_IN_TR]:  'CornerIn',
  [CORNER_IN_BL]:  'CornerIn',
  [CORNER_IN_BR]:  'CornerIn',
  [CORNER_OUT_TL]: 'CornerOut',
  [CORNER_OUT_TR]: 'CornerOut',
  [CORNER_OUT_BL]: 'CornerOut',
  [CORNER_OUT_BR]: 'CornerOut',
  [EDGE_TOP]:      'EdgeH',
  [EDGE_BOTTOM]:   'EdgeH',
  [EDGE_LEFT]:     'EdgeV',
  [EDGE_RIGHT]:    'EdgeV',
  [SINGLE]:        'Single',
  [ROW_LEFT]:      'RowLeft',
  [ROW_MID]:       'RowMid',
  [ROW_RIGHT]:     'RowLeft',
}
