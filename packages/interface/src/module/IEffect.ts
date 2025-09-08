import { ILeaferCanvas, IBoundsData } from '@leafer/interface'

import { IUI } from '../IUI'
import { ICachedShape } from '../ICachedShape'
import { ILeafShadowEffect } from '../type/IComputedType'


export interface IEffectModule {
    shadow(ui: IUI, current: ILeaferCanvas, shape: ICachedShape): void
    innerShadow(ui: IUI, current: ILeaferCanvas, shape: ICachedShape): void
    blur(ui: IUI, current: ILeaferCanvas, origin: ILeaferCanvas): void
    backgroundBlur(ui: IUI, current: ILeaferCanvas, shape: ICachedShape): void

    // shadow
    getShadowSpread(ui: IUI, shadow: ILeafShadowEffect[]): number
    isTransformShadow(shadow: ILeafShadowEffect): boolean
    renderTransformShadow?(ui: IUI, current: ILeaferCanvas, fromCanvas: ILeaferCanvas, fromWorld: IBoundsData, shadow: ILeafShadowEffect): void
}