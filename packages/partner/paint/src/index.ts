import { IPaintModule } from '@leafer-ui/interface'

import { fill, fills } from './Fill'
import { fillText } from './FillText'
import { stroke, strokes } from './Stroke'
import { strokeText, drawTextStroke } from './StrokeText'
import { shape } from './Shape'
import { compute } from './Compute'


export const PaintModule: IPaintModule = {
    compute,
    fill,
    fills,
    fillText,
    stroke,
    strokes,
    strokeText,
    drawTextStroke,
    shape
}