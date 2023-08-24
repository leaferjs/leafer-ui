import { Platform, MatrixHelper } from '@leafer/core'

import { IUI, ILeafPaint, IMatrixData } from '@leafer-ui/interface'


const { get, scale: scaleHelper, copy } = MatrixHelper

export function createPattern(ui: IUI, paint: ILeafPaint, pixelRatio?: number): void {
    const id = ui.__world.width + ui.__world.height

    if (paint.patternId !== id) {

        paint.patternId = id

        const max = 4096
        let scale: number, { a, d } = ui.__world, { width, height, opacity, transform, mode } = paint.data
        if (!pixelRatio) pixelRatio = Platform.devicePixelRatio

        a *= pixelRatio
        d *= pixelRatio
        width *= a
        height *= d

        if (width > max || height > max) {
            scale = Math.max(width / max, height / max)
            width /= scale
            height /= scale
            a /= scale
            d /= scale
        }

        let matrix: IMatrixData
        if (a === 1 && d === 1 && !scale) {
            matrix = transform
        } else {
            matrix = get()
            if (transform) copy(matrix, transform)
            scaleHelper(matrix, 1 / a, 1 / d)
        }

        const style = Platform.canvas.createPattern(paint.image.getCanvas(width, height, opacity) as any, mode === 'repeat' ? 'repeat' : 'no-repeat')

        paint.transform = null

        try {
            if (matrix) style.setTransform ? style.setTransform(matrix) : paint.transform = matrix
        } catch (e) {
            paint.transform = matrix
        }

        paint.style = style
    }
}