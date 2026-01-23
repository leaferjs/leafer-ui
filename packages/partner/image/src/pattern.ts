import { ILeaferCanvas, IRenderOptions } from '@leafer/interface'
import { Platform, MatrixHelper, MathHelper, ImageManager } from '@leafer/core'

import { IUI, ILeafPaint, IMatrixData } from '@leafer-ui/interface'
import { PaintImage } from "@leafer-ui/draw"


const { get, scale, copy } = MatrixHelper
const { getFloorScale } = MathHelper, { abs } = Math

export function createPatternTask(paint: ILeafPaint, ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void {
    if (!paint.patternTask) {
        paint.patternTask = ImageManager.patternTasker.add(async () => {
            PaintImage.createPattern(paint, ui, canvas, renderOptions)
            ui.forceUpdate('surface')
        }, 0, () => {
            paint.patternTask = null
            return canvas.bounds.hit(ui.__nowWorld)
        })
    }
}

export function createPattern(paint: ILeafPaint, ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void {
    let { scaleX, scaleY } = PaintImage.getImageRenderScaleData(paint, ui, canvas, renderOptions), id = scaleX + '-' + scaleY

    if (paint.patternId !== id && !ui.destroyed) {
        if (!(Platform.image.isLarge(paint.image, scaleX, scaleY) && !paint.data.repeat)) {

            const { image, data } = paint, { transform, gap } = data, fixScale = PaintImage.getPatternFixScale(paint, scaleX, scaleY)
            let imageMatrix: IMatrixData, xGap: number, yGap: number, { width, height } = image

            if (fixScale) scaleX *= fixScale, scaleY *= fixScale

            width *= scaleX
            height *= scaleY

            // 平铺间距
            if (gap) {
                xGap = gap.x * scaleX / abs(data.scaleX || 1)
                yGap = gap.y * scaleY / abs(data.scaleY || 1)
            }

            if (transform || scaleX !== 1 || scaleY !== 1) {
                scaleX *= getFloorScale(width + (xGap || 0)) // 缩放至floor画布宽高的状态
                scaleY *= getFloorScale(height + (yGap || 0))

                imageMatrix = get()
                if (transform) copy(imageMatrix, transform)
                scale(imageMatrix, 1 / scaleX, 1 / scaleY)
            }

            const imageCanvas = image.getCanvas(width, height, data.opacity, data.filters, xGap, yGap, ui.leafer && ui.leafer.config.smooth, data.interlace)
            const pattern = image.getPattern(imageCanvas, data.repeat || (Platform.origin.noRepeat || 'no-repeat'), imageMatrix, paint)

            paint.style = pattern
            paint.patternId = id

        }
    }
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