import { ILeaferCanvas, IRenderOptions } from '@leafer/interface'

import { IUI } from '../IUI'
import { ICachedShape } from '../ICachedShape'


export interface IEffectModule {
    shadow?(ui: IUI, current: ILeaferCanvas, shape: ICachedShape, renderOptions: IRenderOptions): void
    innerShadow?(ui: IUI, current: ILeaferCanvas, shape: ICachedShape, renderOptions: IRenderOptions): void
    blur?(ui: IUI, current: ILeaferCanvas, origin: ILeaferCanvas, renderOptions: IRenderOptions): void
    backgroundBlur?(ui: IUI, current: ILeaferCanvas, shape: ICachedShape, renderOptions: IRenderOptions): void
}