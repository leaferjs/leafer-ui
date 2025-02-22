import { IMatrixWithBoundsScaleData, ILeaferCanvas, IFilter } from '@leafer/interface'

import { IUI } from '../IUI'
import { ICachedShape } from '../ICachedShape'


export interface IFilterModule {
    list: IFilterProcessorMap
    register(name: string, fn: IFilterFunction): void
    apply(filters: IFilter[], ui: IUI, bounds: IMatrixWithBoundsScaleData, currentCanvas: ILeaferCanvas, originCanvas: ILeaferCanvas, shape: ICachedShape): void
}

interface IFilterProcessorMap {
    [name: string]: IFilterProcessor
}

export interface IFilterProcessor {
    fn: IFilterFunction
}

export interface IFilterFunction {
    (filter: IFilter, ui: IUI, bounds: IMatrixWithBoundsScaleData, currentCanvas: ILeaferCanvas, originCanvas: ILeaferCanvas, shape: ICachedShape): void
}
