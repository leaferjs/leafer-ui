import { IFunction, ILeaferCanvas, IRenderOptions } from '@leafer/interface'
import { Platform, MatrixHelper, ImageManager } from '@leafer/core'

import { IUI, ILeafPaint, IMatrixData } from '@leafer-ui/interface'
import { PaintImage } from "@leafer-ui/draw"


const { get, scale, copy } = MatrixHelper
const { floor, max } = Math

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

export function createPatternStyle(paint: ILeafPaint, scaleX: number, scaleY: number, ui: IUI, _canvas: ILeaferCanvas, _renderOptions: IRenderOptions, resolve?: IFunction): void {
    const { image, data } = paint, { transform, gap } = data, fixScale = PaintImage.getPatternFixScale(paint, scaleX, scaleY)
    let imageMatrix: IMatrixData, { width, height } = image

    if (fixScale) scaleX *= fixScale, scaleY *= fixScale

    width *= scaleX
    height *= scaleY

    // 平铺间距
    const xGap = gap && (gap.x * scaleX)
    const yGap = gap && (gap.y * scaleY)

    if (transform || scaleX !== 1 || scaleY !== 1) {
        const canvasWidth = width + (xGap || 0), canvasHeight = height + (yGap || 0)
        scaleX *= max(floor(canvasWidth), 1) / canvasWidth // 缩放至floor画布宽高的状态
        scaleY *= max(floor(canvasHeight), 1) / canvasHeight

        imageMatrix = get()
        if (transform) copy(imageMatrix, transform)
        scale(imageMatrix, 1 / scaleX, 1 / scaleY)
    }

    const imageCanvas = image.getCanvas(width, height, data.opacity, data.filters, xGap, yGap, ui.leafer && ui.leafer.config.smooth)
    const pattern = image.getPattern(imageCanvas, data.repeat || (Platform.origin.noRepeat || 'no-repeat'), imageMatrix, paint)
    paint.style = pattern
    resolve && resolve()
}

export function getPatternFixScale(paint: ILeafPaint, scaleX: number, scaleY: number): number {
    const { image } = paint
    let fixScale: number, maxSize = Platform.image.maxPatternSize, imageSize = image.width * image.height

    if (image.isSVG) {
        if (scaleX > 1) fixScale = Math.ceil(scaleX) / scaleX // fix: svg按整数倍放大，避免产生加深线条
    } else {
        if (maxSize > imageSize) maxSize = imageSize // 防止大于元素自身宽高
    }

    if ((imageSize *= scaleX * scaleY) > maxSize) fixScale = Math.sqrt(maxSize / imageSize)
    return fixScale
}