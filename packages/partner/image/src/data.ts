import { IBoundsData, ILeaferImage, IScaleData } from '@leafer/interface'
import { MatrixHelper, MathHelper, Bounds, AlignHelper, BoundsHelper, PointHelper } from '@leafer/core'

import { IImagePaint, ILeafPaint, ILeafPaintPatternData } from '@leafer-ui/interface'

import { clipMode, fillOrFitMode, repeatMode } from './mode'


const { get, translate } = MatrixHelper
const tempBox = new Bounds()
const tempScaleData = {} as IScaleData
const tempImage = {} as IBoundsData

export function createData(leafPaint: ILeafPaint, image: ILeaferImage, paint: IImagePaint, box: IBoundsData): void {
    const { changeful, sync } = paint
    if (changeful) leafPaint.changeful = changeful
    if (sync) leafPaint.sync = sync
    leafPaint.data = getPatternData(paint, box, image)
}

export function getPatternData(paint: IImagePaint, box: IBoundsData, image: ILeaferImage): ILeafPaintPatternData {
    if (paint.padding) box = tempBox.set(box).shrink(paint.padding)
    if (paint.mode === 'strench' as string) paint.mode = 'stretch' // 兼容代码，后续可移除

    let { width, height } = image
    const { opacity, mode, align, offset, scale, size, rotation, skew, repeat, filters } = paint
    const sameBox = box.width === width && box.height === height

    const data: ILeafPaintPatternData = { mode }
    const swapSize = align !== 'center' && (rotation || 0) % 180 === 90
    BoundsHelper.set(tempImage, 0, 0, swapSize ? height : width, swapSize ? width : height)

    let scaleX: number, scaleY: number

    if (!mode || mode === 'cover' || mode === 'fit') { // mode 默认值为 cover
        if (!sameBox || rotation) {
            scaleX = scaleY = BoundsHelper.getFitScale(box, tempImage, mode !== 'fit')
            BoundsHelper.put(box, image, align, scaleX, false, tempImage)
            BoundsHelper.scale(tempImage, scaleX, scaleY, true)
        }
    } else {
        if (scale || size) {
            MathHelper.getScaleData(scale, size, image, tempScaleData)
            scaleX = tempScaleData.scaleX
            scaleY = tempScaleData.scaleY
        }

        if (align) {
            if (scaleX) BoundsHelper.scale(tempImage, scaleX, scaleY, true)
            AlignHelper.toPoint(align, tempImage, box, tempImage, true, true)
        }
    }

    if (offset) PointHelper.move(tempImage, offset)

    switch (mode) {
        case 'stretch':
            if (!sameBox) width = box.width, height = box.height
            break
        case 'normal':
        case 'clip':
            if (tempImage.x || tempImage.y || scaleX || rotation || skew) clipMode(data, box, tempImage.x, tempImage.y, scaleX, scaleY, rotation, skew)
            break
        case 'repeat':
            if (!sameBox || scaleX || rotation) repeatMode(data, box, width, height, tempImage.x, tempImage.y, scaleX, scaleY, rotation, align)
            if (!repeat) data.repeat = 'repeat'
            break
        case 'fit':
        case 'cover':
        default:
            if (scaleX) fillOrFitMode(data, box, tempImage.x, tempImage.y, scaleX, scaleY, rotation)
    }

    if (!data.transform) {
        if (box.x || box.y) {
            data.transform = get()
            translate(data.transform, box.x, box.y)
        }
    }

    if (scaleX && mode !== 'stretch') {
        data.scaleX = scaleX
        data.scaleY = scaleY
    }

    data.width = width
    data.height = height
    if (opacity) data.opacity = opacity
    if (filters) data.filters = filters
    if (repeat) data.repeat = typeof repeat === 'string' ? (repeat === 'x' ? 'repeat-x' : 'repeat-y') : 'repeat'
    return data
}