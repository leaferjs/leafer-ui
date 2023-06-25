import { ILeaferCanvas, IRenderOptions } from '@leafer/interface'

import { ILeafPaint } from '../type/IComputedType'
import { IUI } from '../IUI'
import { ICachedShape } from '../ICachedShape'

export interface IPaintModule {
    computeFill?(ui: IUI): void
    computeStroke?(ui: IUI): void

    fill?(ui: IUI, canvas: ILeaferCanvas, fill: string | object): void
    fills?(ui: IUI, canvas: ILeaferCanvas, fills: ILeafPaint[]): void

    drawText?(ui: IUI, canvas: ILeaferCanvas): void

    stroke?(ui: IUI, canvas: ILeaferCanvas, stroke: string | object): void
    strokes?(ui: IUI, canvas: ILeaferCanvas, strokes: ILeafPaint[]): void

    strokeText?(ui: IUI, canvas: ILeaferCanvas, stroke: string | object): void
    strokesText?(ui: IUI, canvas: ILeaferCanvas, strokes: ILeafPaint[]): void

    drawTextStroke?(ui: IUI, canvas: ILeaferCanvas): void

    shape?(ui: IUI, current: ILeaferCanvas, options: IRenderOptions): ICachedShape
}
