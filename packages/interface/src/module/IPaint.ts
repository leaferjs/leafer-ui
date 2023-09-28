import { ILeaferCanvas, IRenderOptions, IBooleanMap } from '@leafer/interface'

import { ILeafPaint } from '../type/IComputedType'
import { IUI, IUIData } from '../IUI'
import { ICachedShape } from '../ICachedShape'

export interface IPaintModule {
    compute?(attrName: 'fill' | 'stroke', ui: IUI): void

    fill?(fill: string, ui: IUI, canvas: ILeaferCanvas,): void
    fills?(fills: ILeafPaint[], ui: IUI, canvas: ILeaferCanvas): void

    fillText?(ui: IUI, canvas: ILeaferCanvas): void

    stroke?(stroke: string, ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void
    strokes?(strokes: ILeafPaint[], ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void

    strokeText?(stroke: string, ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void
    strokesText?(strokes: ILeafPaint[], ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void

    drawTextStroke?(ui: IUI, canvas: ILeaferCanvas): void

    shape?(ui: IUI, current: ILeaferCanvas, renderOptions: IRenderOptions): ICachedShape

    recycleImage?(attrName: 'fill' | 'stroke', data: IUIData): IBooleanMap
}
