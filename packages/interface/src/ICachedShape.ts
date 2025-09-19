import { ILeaferCanvas, IBoundsData, ICachedLeaf } from '@leafer/interface'

export interface ICachedShape extends ICachedLeaf {
    worldCanvas?: ILeaferCanvas // 元素太大放不下，经过裁剪后的元素区域缓存画布
    shapeBounds: IBoundsData // 形状内容的包围盒，可能缩小了，但未进行偏移
    // bounds: IBoundsData // 形状内容的包围盒，可能会缩小、偏移至原点
    renderBounds: IBoundsData // 渲染内容的包围盒，可能会缩小、偏移至原点
    scaleX: number
    scaleY: number
}
