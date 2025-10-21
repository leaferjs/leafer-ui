import { IFunction, ILeaferCanvas, IRenderOptions } from '@leafer/interface'
import { Platform, MatrixHelper, MathHelper, ImageManager } from '@leafer/core'

import { IUI, ILeafPaint, IMatrixData } from '@leafer-ui/interface'
import { PaintImage } from "@leafer-ui/draw"


const { get, scale, copy } = MatrixHelper
const { getFloorScale } = MathHelper, { abs } = Math

export function createPatternTask(paint: ILeafPaint, ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void {
    if (!paint.patternTask) {
        paint.patternTask = ImageManager.patternTasker.add(async () => {
            paint.patternTask = null
            if (canvas.bounds.hit(ui.__nowWorld)) PaintImage.createPattern(paint, ui, canvas, renderOptions)
            ui.forceUpdate('surface')
        }, 300)
    }
}

export function createPattern(paint: ILeafPaint, ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions, resolve?: IFunction): boolean {
    const { scaleX, scaleY } = PaintImage.getImageRenderScaleData(paint, ui, canvas, renderOptions), id = scaleX + '-' + scaleY

    if (paint.patternId !== id && !ui.destroyed) {
        if (!(Platform.image.isLarge(paint.image, scaleX, scaleY) && !paint.data.repeat)) {
            paint.patternId = id
            PaintImage.createPatternStyle(paint, scaleX, scaleY, ui, canvas, renderOptions, resolve)
            return true
        }
    }

    resolve && resolve()
    return false // same as check()

}

export function createPatternStyle(paint: ILeafPaint, imageScaleX: number, imageScaleY: number, ui: IUI, _canvas: ILeaferCanvas, _renderOptions: IRenderOptions, resolve?: IFunction): void {
    const { image, data } = paint, { transform, gap } = data, fixScale = PaintImage.getPatternFixScale(paint, imageScaleX, imageScaleY)
    let imageMatrix: IMatrixData, xGap: number, yGap: number, { width, height } = image

    if (fixScale) imageScaleX *= fixScale, imageScaleY *= fixScale

    width *= imageScaleX
    height *= imageScaleY

    // 平铺间距
    if (gap) {
        xGap = gap.x * imageScaleX / abs(data.scaleX || 1)
        yGap = gap.y * imageScaleY / abs(data.scaleY || 1)
    }

    if (transform || imageScaleX !== 1 || imageScaleY !== 1) {
        imageScaleX *= getFloorScale(width + (xGap || 0)) // 缩放至floor画布宽高的状态
        imageScaleY *= getFloorScale(height + (yGap || 0))

        imageMatrix = get()
        if (transform) copy(imageMatrix, transform)
        scale(imageMatrix, 1 / imageScaleX, 1 / imageScaleY)
    }

    const imageCanvas = image.getCanvas(width, height, data.opacity, data.filters, xGap, yGap, ui.leafer && ui.leafer.config.smooth)
    const pattern = image.getPattern(imageCanvas, data.repeat || (Platform.origin.noRepeat || 'no-repeat'), imageMatrix, paint)
    paint.style = pattern
    resolve && resolve()
}

export function getPatternFixScale(paint: ILeafPaint, imageScaleX: number, imageScaleY: number): number {
    const { image } = paint
    let fixScale: number, maxSize = Platform.image.maxPatternSize, imageSize = image.width * image.height

    if (image.isSVG) {
        if (imageScaleX > 1) fixScale = Math.ceil(imageScaleX) / imageScaleX // fix: svg按整数倍放大，避免产生加深线条
    } else {
        if (maxSize > imageSize) maxSize = imageSize // 防止大于元素自身宽高
    }

    if ((imageSize *= imageScaleX * imageScaleY) > maxSize) fixScale = Math.sqrt(maxSize / imageSize)
    return fixScale
}