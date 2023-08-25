import { Platform, MatrixHelper } from '@leafer/core'

import { IUI, ILeafPaint, IMatrixData } from '@leafer-ui/interface'


const { get, scale: scaleHelper, copy } = MatrixHelper

export function createPattern(ui: IUI, paint: ILeafPaint, pixelRatio: number): void {
    const id = ui.__world.width + ui.__world.height

    if (paint.patternId !== id) {

        paint.patternId = id

        let scale: number, matrix: IMatrixData, { a, d } = ui.__world, { width, height, scaleX, scaleY, opacity, transform, mode } = paint.data

        if (scaleX) {
            matrix = get()
            copy(matrix, transform)
            scaleHelper(matrix, 1 / scaleX, 1 / scaleY)
            a *= scaleX
            d *= scaleY
        }

        a *= pixelRatio
        d *= pixelRatio
        width *= a
        height *= d

        const { image } = paint
        const maxWidth = image.isSVG ? 4096 : Math.min(image.width, 4096)
        const maxHeight = image.isSVG ? 4096 : Math.min(image.height, 4096)

        if (width > maxWidth || height > maxHeight) {
            scale = Math.max(width / maxWidth, height / maxHeight)

            a /= scale
            d /= scale
            width /= scale
            height /= scale
        }

        if (scaleX) {
            a /= scaleX
            d /= scaleY
        }

        if (transform || a !== 1 || d !== 1) {
            if (!matrix) {
                matrix = get()
                if (transform) copy(matrix, transform)
            }
            scaleHelper(matrix, 1 / a, 1 / d)
        }

        const style = Platform.canvas.createPattern(paint.image.getCanvas(width, height, opacity) as any, mode === 'repeat' ? 'repeat' : (Platform.origin.noRepeat || 'no-repeat'))

        paint.transform = null

        try {
            if (matrix) style.setTransform ? style.setTransform(matrix) : paint.transform = matrix
        } catch (e) {
            paint.transform = matrix
        }

        paint.style = style
    }
}