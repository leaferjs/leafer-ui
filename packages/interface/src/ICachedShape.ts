import { ILeaferCanvas, IBoundsData, ICachedLeaf } from '@leafer/interface'

export interface ICachedShape extends ICachedLeaf {
    worldCanvas?: ILeaferCanvas
    shapeBounds: IBoundsData
    scaleX: number
    scaleY: number
}
