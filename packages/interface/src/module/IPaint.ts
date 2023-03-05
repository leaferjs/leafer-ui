import { ILeaferCanvas } from '@leafer/interface'

import { ILeafPaint } from '../type/IComputedType'
import { IUI } from '../IUI'

export interface IPaintModule {
    fill?(ui: IUI, canvas: ILeaferCanvas, fill: string | object): void
    fills?(ui: IUI, canvas: ILeaferCanvas, fills: ILeafPaint[]): void

    stroke?(ui: IUI, canvas: ILeaferCanvas, stroke: string | object): void
    strokes?(ui: IUI, canvas: ILeaferCanvas, strokes: ILeafPaint[]): void
}
