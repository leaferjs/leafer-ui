import { Platform, MatrixHelper } from '@leafer/core'

import { IUI, ILeafPaint, IMatrixData } from '@leafer-ui/interface'


const { get, scale, copy } = MatrixHelper
const { ceil, abs } = Math

export function createPattern(ui: IUI, paint: ILeafPaint, pixelRatio: number): boolean {

    let { scaleX, scaleY } = ui.__world

    const id = scaleX + '-' + scaleY

    if (paint.patternId !== id && !ui.destroyed) {

        scaleX = abs(scaleX) // maybe -1
        scaleY = abs(scaleY)

        const { image, data } = paint
        let imageScale: number, imageMatrix: IMatrixData, { width, height, scaleX: sx, scaleY: sy, opacity, transform, repeat } = data

        if (sx) {
            imageMatrix = get()
            copy(imageMatrix, transform)
            scale(imageMatrix, 1 / sx, 1 / sy)
            scaleX *= sx
            scaleY *= sy
        }

        scaleX *= pixelRatio
        scaleY *= pixelRatio
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

        const canvas = image.getCanvas(ceil(width) || 1, ceil(height) || 1, opacity)
        const pattern = image.getPattern(canvas, repeat || (Platform.origin.noRepeat || 'no-repeat'), imageMatrix, paint)

        paint.style = pattern
        paint.patternId = id

        return true

    } else {

        return false

    }

}