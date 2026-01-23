import { IBoundsData, IGap, ILeaferImage, IPointData, IPointGap, IScaleData } from '@leafer/interface'
import { MatrixHelper, MathHelper, Bounds, AlignHelper, BoundsHelper, PointHelper, isObject, isString, isNumber } from '@leafer/core'

import { IImagePaint, ILeafPaint, ILeafPaintPatternData } from '@leafer-ui/interface'
import { PaintImage } from "@leafer-ui/draw"


const { get, translate } = MatrixHelper
const tempBox = new Bounds()
const tempScaleData = {} as IScaleData
const tempImage = {} as IBoundsData

export function createData(leafPaint: ILeafPaint, image: ILeaferImage, paint: IImagePaint, box: IBoundsData): void {
    leafPaint.data = PaintImage.getPatternData(paint, box, image)
}

export function getPatternData(paint: IImagePaint, box: IBoundsData, image: ILeaferImage): ILeafPaintPatternData {
    if (paint.padding) box = tempBox.set(box).shrink(paint.padding)
    if (paint.mode === 'strench' as string) paint.mode = 'stretch' // 兼容代码，后续可移除

    const { width, height } = image
    const { opacity, mode, align, offset, scale, size, rotation, skew, clipSize, repeat, gap, filters, interlace } = paint
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

        if (align || gap || repeat) {
            if (scaleX) BoundsHelper.scale(tempImage, scaleX, scaleY, true)
            if (align) AlignHelper.toPoint(align, tempImage, box, tempImage, true, true)
        }
    }

    if (offset) PointHelper.move(tempImage, offset)

    switch (mode) {
        case 'stretch':
            if (!sameBox) {
                scaleX = box.width / width, scaleY = box.height / height
                PaintImage.stretchMode(data, box, scaleX, scaleY)
            } else if (scaleX) scaleX = scaleY = undefined
            break
        case 'normal':
        case 'clip':
            if (tempImage.x || tempImage.y || scaleX || clipSize || rotation || skew) {
                let clipScaleX: number, clipScaleY: number
                if (clipSize) clipScaleX = box.width / clipSize.width, clipScaleY = box.height / clipSize.height
                PaintImage.clipMode(data, box, tempImage.x, tempImage.y, scaleX, scaleY, rotation, skew, clipScaleX, clipScaleY)
                if (clipScaleX) scaleX = scaleX ? scaleX * clipScaleX : clipScaleX, scaleY = scaleY ? scaleY * clipScaleY : clipScaleY
            }
            break
        case 'repeat':
            if (!sameBox || scaleX || rotation || skew) PaintImage.repeatMode(data, box, width, height, tempImage.x, tempImage.y, scaleX, scaleY, rotation, skew, align, paint.freeTransform)
            if (!repeat) data.repeat = 'repeat'
            const count = isObject(repeat)
            if (gap || count) data.gap = getGapData(gap, count && repeat, tempImage.width, tempImage.height, box)
            break
        case 'fit':
        case 'cover':
        default:
            if (scaleX) PaintImage.fillOrFitMode(data, box, tempImage.x, tempImage.y, scaleX, scaleY, rotation)
    }

    if (!data.transform) {
        if (box.x || box.y) translate(data.transform = get(), box.x, box.y)
    }

    if (scaleX) {
        data.scaleX = scaleX
        data.scaleY = scaleY
    }

    if (opacity && opacity < 1) data.opacity = opacity
    if (filters) data.filters = filters
    if (repeat) data.repeat = isString(repeat) ? (repeat === 'x' ? 'repeat-x' : 'repeat-y') : 'repeat'
    if (interlace) data.interlace = (isNumber(interlace) || interlace.type === 'percent') ? { type: 'x', offset: interlace } : interlace
    return data
}


function getGapData(gap: IGap | IPointGap, repeat: IPointData, width: number, height: number, box: IBoundsData): IPointData {
    let xGap: IGap, yGap: IGap
    if (isObject(gap)) xGap = gap.x, yGap = gap.y
    else xGap = yGap = gap
    return { x: getGapValue(xGap, width, box.width, repeat && repeat.x), y: getGapValue(yGap, height, box.height, repeat && repeat.y) }
}

function getGapValue(gap: IGap, size: number, totalSize: number, rows: number): number {
    const auto = isString(gap) || rows
    const remain = rows ? totalSize - rows * size : totalSize % size
    const value = auto ? remain / ((rows || Math.floor(totalSize / size)) - 1) : gap
    return gap === 'auto' ? (value < 0 ? 0 : value) : value
}