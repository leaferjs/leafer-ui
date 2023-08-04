import { ILeaferCanvas, IRenderOptions } from '@leafer/interface'

import { IUI } from '../IUI'
import { ICachedShape } from '../ICachedShape'


export interface IEffectModule {
    shadow?(ui: IUI, current: ILeaferCanvas, shape: ICachedShape, options: IRenderOptions): void
    innerShadow?(ui: IUI, current: ILeaferCanvas, shape: ICachedShape, options: IRenderOptions): void
    blur?(ui: IUI, current: ILeaferCanvas, origin: ILeaferCanvas, options: IRenderOptions): void
    backgroundBlur?(ui: IUI, current: ILeaferCanvas, shape: ICachedShape, options: IRenderOptions): void
}