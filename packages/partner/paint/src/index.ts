import { IPaintModule } from '@leafer-ui/interface'

import { fill, fills, fillPathOrText } from './Fill'
import { fillText } from './FillText'
import { stroke, strokes } from './Stroke'
import { strokeText, drawTextStroke, drawStrokesStyle } from './StrokeText'
import { shape } from './Shape'
import { compute } from './Compute'


export const PaintModule: IPaintModule = {
    compute,

    fill,
    fills,
    fillPathOrText,
    fillText,

    stroke,
    strokes,
    strokeText,
    drawTextStroke,
    drawStrokesStyle,

    shape
}