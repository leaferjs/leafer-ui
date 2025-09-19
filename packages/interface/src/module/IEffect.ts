import { ILeaferCanvas, IFourNumber, IBoundsData, IMatrixData } from '@leafer/interface'

import { IUI } from '../IUI'
import { ICachedShape } from '../ICachedShape'
import { ILeafShadowEffect } from '../type/IComputedType'


export interface IEffectModule {
    shadow(ui: IUI, current: ILeaferCanvas, shape: ICachedShape): void
    innerShadow(ui: IUI, current: ILeaferCanvas, shape: ICachedShape): void
    blur(ui: IUI, current: ILeaferCanvas, origin: ILeaferCanvas): void
    backgroundBlur(ui: IUI, current: ILeaferCanvas, shape: ICachedShape): void

    // shadow
    getShadowRenderSpread(ui: IUI, shadow: ILeafShadowEffect[], spreadSign?: 1 | -1): IFourNumber
    getShadowTransform(ui: IUI, canvas: ILeaferCanvas, shape: ICachedShape, shadow: ILeafShadowEffect, outBounds: IBoundsData, otherScale: number, isInnerShaodw?: boolean): IMatrixData
    isTransformShadow(shadow: ILeafShadowEffect): boolean

    getInnerShadowSpread(ui: IUI, innerShadow: ILeafShadowEffect[]): IFourNumber
}