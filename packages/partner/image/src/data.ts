import { IBoundsData, ILeaferImage, IPointData } from '@leafer/interface'
import { MatrixHelper, Bounds, AlignHelper } from '@leafer/core'

import { IImagePaint, ILeafPaint, ILeafPaintPatternData } from '@leafer-ui/interface'

import { clipMode, fillOrFitMode, repeatMode } from './mode'


const { get, translate } = MatrixHelper
const tempBox = new Bounds()
const tempPoint = {} as IPointData

export function createData(leafPaint: ILeafPaint, image: ILeaferImage, paint: IImagePaint, box: IBoundsData): void {
    let { width, height } = image
    if (paint.padding) box = tempBox.set(box).shrink(paint.padding)

    const { opacity, mode, align, offset, scale, size, rotation, blendMode, repeat } = paint
    const sameBox = box.width === width && box.height === height
    if (blendMode) leafPaint.blendMode = blendMode

    const data: ILeafPaintPatternData = leafPaint.data = { mode }
    const swapSize = align !== 'center' && (rotation || 0) % 180 === 90
    const swapWidth = swapSize ? height : width, swapHeight = swapSize ? width : height

    let x = 0, y = 0, scaleX: number, scaleY: number

    if (!mode || mode === 'cover' || mode === 'fit') {
        if (!sameBox || rotation) {
            const sw = box.width / swapWidth, sh = box.height / swapHeight
            scaleX = scaleY = mode === 'fit' ? Math.min(sw, sh) : Math.max(sw, sh)
            x += (box.width - width * scaleX) / 2, y += (box.height - height * scaleY) / 2
        }
    } else if (size) {
        scaleX = (typeof size === 'number' ? size : size.width) / width
        scaleY = (typeof size === 'number' ? size : size.height) / height
    } else if (scale) {
        scaleX = typeof scale === 'number' ? scale : scale.x
        scaleY = typeof scale === 'number' ? scale : scale.y
    }

    if (align) {
        const imageBounds = { x, y, width: swapWidth, height: swapHeight }
        if (scaleX) imageBounds.width *= scaleX, imageBounds.height *= scaleY
        AlignHelper.toPoint(align, imageBounds, box, tempPoint, true)
        x += tempPoint.x, y += tempPoint.y
    }

    if (offset) x += offset.x, y += offset.y

    switch (mode) {
        case 'strench':
            if (!sameBox) width = box.width, height = box.height
            break
        case 'normal':
        case 'clip':
            if (x || y || scaleX || rotation) clipMode(data, box, x, y, scaleX, scaleY, rotation)
            break
        case 'repeat':
            if (!sameBox || scaleX || rotation) repeatMode(data, box, width, height, x, y, scaleX, scaleY, rotation, align)
            if (!repeat) data.repeat = 'repeat'
            break
        case 'fit':
        case 'cover':
        default:
            if (scaleX) fillOrFitMode(data, box, x, y, scaleX, scaleY, rotation)
    }

    if (!data.transform) {
        if (box.x || box.y) {
            data.transform = get()
            translate(data.transform, box.x, box.y)
        }
    }

    if (scaleX && mode !== 'strench') {
        data.scaleX = scaleX
        data.scaleY = scaleY
    }

    data.width = width
    data.height = height
    if (opacity) data.opacity = opacity
    if (repeat) data.repeat = typeof repeat === 'string' ? (repeat === 'x' ? 'repeat-x' : 'repeat-y') : 'repeat'
}
