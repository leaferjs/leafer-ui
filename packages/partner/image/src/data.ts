import { IBoundsData, ILeaferImage } from '@leafer/interface'
import { MatrixHelper } from '@leafer/core'

import { IImagePaint, ILeafPaint, ILeafPaintPatternData } from '@leafer-ui/interface'

import { clipMode, fillOrFitMode, repeatMode } from './mode'


const { get, translate } = MatrixHelper

export function createData(leafPaint: ILeafPaint, image: ILeaferImage, paint: IImagePaint, box: IBoundsData): void {
    let { width, height } = image

    const { opacity, mode, offset, scale, size, rotation, blendMode, repeat } = paint
    const sameBox = box.width === width && box.height === height
    if (blendMode) leafPaint.blendMode = blendMode

    const data: ILeafPaintPatternData = leafPaint.data = { mode }

    let x: number, y: number, scaleX: number, scaleY: number
    if (offset) x = offset.x, y = offset.y
    if (size) {
        scaleX = (typeof size === 'number' ? size : size.width) / width
        scaleY = (typeof size === 'number' ? size : size.height) / height
    } else if (scale) {
        scaleX = typeof scale === 'number' ? scale : scale.x
        scaleY = typeof scale === 'number' ? scale : scale.y
    }

    switch (mode) {
        case 'strench':
            if (!sameBox) width = box.width, height = box.height
            if (box.x || box.y) {
                data.transform = get()
                translate(data.transform, box.x, box.y)
            }
            break
        case 'clip':
            if (offset || scaleX || rotation) clipMode(data, box, x, y, scaleX, scaleY, rotation)
            break
        case 'repeat':
            if (!sameBox || scaleX || rotation) repeatMode(data, box, width, height, x, y, scaleX, scaleY, rotation)
            if (!repeat) data.repeat = 'repeat'
            break
        case 'fit':
        case 'cover':
        default:
            if (!sameBox || rotation) fillOrFitMode(data, mode, box, width, height, rotation)
    }

    data.width = width
    data.height = height
    if (opacity) data.opacity = opacity
    if (repeat) data.repeat = typeof repeat === 'string' ? (repeat === 'x' ? 'repeat-x' : 'repeat-y') : 'repeat'
}
