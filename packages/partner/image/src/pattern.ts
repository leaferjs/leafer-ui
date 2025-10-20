import { IFunction, ILeaferCanvas, IRenderOptions } from '@leafer/interface'
import { Platform, MatrixHelper, ImageManager } from '@leafer/core'

import { IUI, ILeafPaint, IMatrixData } from '@leafer-ui/interface'
import { PaintImage } from "@leafer-ui/draw"


const { get, scale, copy } = MatrixHelper
const { floor, ceil, max, abs } = Math

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
    let { scaleX, scaleY } = PaintImage.getImageRenderScaleData(paint, ui, canvas)
    const id = scaleX + '-' + scaleY

    if (paint.patternId !== id && !ui.destroyed) {

        const { image, data } = paint
        let imageScale: number, imageMatrix: IMatrixData, { width, height, } = image, { scaleX: sx, scaleY: sy, transform, repeat, gap } = data

        if (sx) {
            sx = abs(sx) // maybe -1
            sy = abs(sy)
            imageMatrix = get()
            copy(imageMatrix, transform)
            scale(imageMatrix, 1 / sx, 1 / sy)
        }

        width *= scaleX
        height *= scaleY

        const size = width * height

        if (!repeat) {
            if (size > Platform.image.maxCacheSize) {
                resolve && resolve()
                return false // same as check()
            }
        }

        let maxSize = Platform.image.maxPatternSize

        if (image.isSVG) {
            const ws = width / image.width
            if (ws > 1) imageScale = ws / ceil(ws) // fix: svg按整数倍放大，避免产生加深线条
        } else {
            const imageSize = image.width * image.height
            if (maxSize > imageSize) maxSize = imageSize
        }

        if (size > maxSize) imageScale = Math.sqrt(size / maxSize)

        if (imageScale) {
            scaleX /= imageScale
            scaleY /= imageScale
            width /= imageScale
            height /= imageScale
        }

        if (sx) {
            scaleX /= sx
            scaleY /= sy
        }

        // 间距
        const xGap = gap && (gap.x * scaleX)
        const yGap = gap && (gap.y * scaleY)

        if (transform || scaleX !== 1 || scaleY !== 1) {

            // 缩放至floor画布宽高的状态
            const canvasWidth = width + (xGap || 0)
            const canvasHeight = height + (yGap || 0)
            scaleX /= canvasWidth / max(floor(canvasWidth), 1)
            scaleY /= canvasHeight / max(floor(canvasHeight), 1)

            if (!imageMatrix) {
                imageMatrix = get()
                if (transform) copy(imageMatrix, transform)
            }

            scale(imageMatrix, 1 / scaleX, 1 / scaleY)

        }

        paint.patternId = id
        PaintImage.createPatternStyle(paint, imageMatrix, width, height, xGap, yGap, ui, canvas, renderOptions, resolve)

        return true

    } else {

        resolve && resolve()
        return false

    }

}

export function createPatternStyle(paint: ILeafPaint, transform: IMatrixData, width: number, height: number, xGap: number, yGap: number, ui: IUI, _canvas: ILeaferCanvas, _renderOptions: IRenderOptions, resolve?: IFunction): void {
    const { image, data } = paint
    const imageCanvas = image.getCanvas(width, height, data.opacity, data.filters, xGap, yGap, ui.leafer && ui.leafer.config.smooth)
    const pattern = image.getPattern(imageCanvas, data.repeat || (Platform.origin.noRepeat || 'no-repeat'), transform, paint)
    paint.style = pattern
    resolve && resolve()
}