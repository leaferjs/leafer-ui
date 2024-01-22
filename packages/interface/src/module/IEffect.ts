import { ILeaferCanvas } from '@leafer/interface'

import { IUI } from '../IUI'
import { ICachedShape } from '../ICachedShape'


export interface IEffectModule {
    shadow(ui: IUI, current: ILeaferCanvas, shape: ICachedShape): void
    innerShadow(ui: IUI, current: ILeaferCanvas, shape: ICachedShape): void
    blur(ui: IUI, current: ILeaferCanvas, origin: ILeaferCanvas): void
    backgroundBlur(ui: IUI, current: ILeaferCanvas, shape: ICachedShape): void
}