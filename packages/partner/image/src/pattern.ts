import { Platform, MatrixHelper } from '@leafer/core'

import { IUI, ILeafPaint, IMatrixData } from '@leafer-ui/interface'


const { get, scale, copy } = MatrixHelper
const { floor, max, abs } = Math

export function createPattern(ui: IUI, paint: ILeafPaint, pixelRatio: number): boolean {
    let { scaleX, scaleY } = ui.getRenderScaleData(true, paint.scaleFixed)
    const id = scaleX + '-' + scaleY + '-' + pixelRatio

    if (paint.patternId !== id && !ui.destroyed) {

        const { image, data } = paint
        let imageScale: number, imageMatrix: IMatrixData, { width, height, scaleX: sx, scaleY: sy, transform, repeat, gap } = data

        scaleX *= pixelRatio
        scaleY *= pixelRatio

        const xGap = gap && (gap.x * scaleX)
        const yGap = gap && (gap.y * scaleY)

        if (sx) {
            sx = abs(sx) // maybe -1
            sy = abs(sy)
            imageMatrix = get()
            copy(imageMatrix, transform)
            scale(imageMatrix, 1 / sx, 1 / sy)
            scaleX *= sx
            scaleY *= sy
        }

        width *= scaleX
        height *= scaleY

        const size = width * height

        if (!repeat) {
            if (size > Platform.image.maxCacheSize) return false // same as check()
        }

        let maxSize = Platform.image.maxPatternSize

        if (!image.isSVG) {
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

        if (transform || scaleX !== 1 || scaleY !== 1) {
            if (!imageMatrix) {
                imageMatrix = get()
                if (transform) copy(imageMatrix, transform)
            }
            scale(imageMatrix, 1 / scaleX, 1 / scaleY)
        }

        if (imageMatrix) {
            const canvasWidth = width + (xGap || 0), canvasHeight = height + (yGap || 0)
            scale(imageMatrix, canvasWidth / max(floor(canvasWidth), 1), canvasHeight / max(floor(canvasHeight), 1)) // 缩放至floor画布宽高的状态
        }

        const canvas = image.getCanvas(width, height, data.opacity, data.filters, xGap, yGap)
        const pattern = image.getPattern(canvas, repeat || (Platform.origin.noRepeat || 'no-repeat'), imageMatrix, paint)

        paint.style = pattern
        paint.patternId = id

        return true

    } else {

        return false

    }

}