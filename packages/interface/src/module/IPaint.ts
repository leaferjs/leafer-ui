import { ILeaferCanvas, IRenderOptions } from '@leafer/interface'

import { ILeafPaint } from '../type/IComputedType'
import { IUI } from '../IUI'
import { ICachedShape } from '../ICachedShape'

export interface IPaintModule {
    compute?(ui: IUI, attrName: 'fill' | 'stroke'): void

    fill?(ui: IUI, canvas: ILeaferCanvas, fill: string): void
    fills?(ui: IUI, canvas: ILeaferCanvas, fills: ILeafPaint[]): void

    fillText?(ui: IUI, canvas: ILeaferCanvas): void

    stroke?(ui: IUI, canvas: ILeaferCanvas, stroke: string): void
    strokes?(ui: IUI, canvas: ILeaferCanvas, strokes: ILeafPaint[]): void

    strokeText?(ui: IUI, canvas: ILeaferCanvas, stroke: string): void
    strokesText?(ui: IUI, canvas: ILeaferCanvas, strokes: ILeafPaint[]): void

    drawTextStroke?(ui: IUI, canvas: ILeaferCanvas): void

    shape?(ui: IUI, current: ILeaferCanvas, options: IRenderOptions): ICachedShape
}
