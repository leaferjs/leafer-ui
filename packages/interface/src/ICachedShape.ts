import { ILeaferCanvas, IBoundsData, ICachedLeaf } from '@leafer/interface'

export interface ICachedShape extends ICachedLeaf {
    worldCanvas?: ILeaferCanvas // 元素太大放不下，经过裁剪后的元素区域缓存画布
    shapeBounds: IBoundsData
    scaleX: number
    scaleY: number
}
