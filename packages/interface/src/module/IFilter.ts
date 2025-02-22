import { IMatrixWithBoundsScaleData, ILeaferCanvas, IFilter } from '@leafer/interface'

import { IUI } from '../IUI'
import { ICachedShape } from '../ICachedShape'


export interface IFilterModule {
    list: IFilterProcessorMap
    register(name: string, filterProcessor: IFilterProcessor): void
    apply(filters: IFilter[], ui: IUI, bounds: IMatrixWithBoundsScaleData, currentCanvas: ILeaferCanvas, originCanvas: ILeaferCanvas, shape: ICachedShape): void
    getSpread(filters: IFilter[]): number
}

interface IFilterProcessorMap {
    [name: string]: IFilterProcessor
}

export interface IFilterProcessor {
    apply: IFilterFunction,
    getSpread(filter: IFilter): number
}

export interface IFilterFunction {
    (filter: IFilter, ui: IUI, bounds: IMatrixWithBoundsScaleData, currentCanvas: ILeaferCanvas, originCanvas: ILeaferCanvas, shape: ICachedShape): void
}
