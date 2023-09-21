import { Platform, MatrixHelper } from '@leafer/core'

import { IUI, ILeafPaint, IMatrixData } from '@leafer-ui/interface'


const { get, scale: scaleHelper, copy } = MatrixHelper

export function createPattern(ui: IUI, paint: ILeafPaint, pixelRatio: number): boolean {

    let { scaleX, scaleY } = ui.__world

    const id = scaleX + '-' + scaleY

    if (paint.patternId !== id && !ui.destroyed) {

        paint.patternId = id

        scaleX = Math.abs(scaleX) // maybe -1
        scaleY = Math.abs(scaleY)

        const { image, data } = paint
        const maxWidth = image.isSVG ? 4096 : Math.min(image.width, 4096)
        const maxHeight = image.isSVG ? 4096 : Math.min(image.height, 4096)
        let scale: number, matrix: IMatrixData, { width, height, scaleX: sx, scaleY: sy, opacity, transform, mode } = data

        if (sx) {
            matrix = get()
            copy(matrix, transform)
            scaleHelper(matrix, 1 / sx, 1 / sy)
            scaleX *= sx
            scaleY *= sy
        }

        scaleX *= pixelRatio
        scaleY *= pixelRatio
        width *= scaleX
        height *= scaleY

        if (width > maxWidth || height > maxHeight) {
            scale = Math.max(width / maxWidth, height / maxHeight)
        }

        if (scale) {
            scaleX /= scale
            scaleY /= scale
            width /= scale
            height /= scale
        }

        if (sx) {
            scaleX /= sx
            scaleY /= sy
        }

        if (transform || scaleX !== 1 || scaleY !== 1) {
            if (!matrix) {
                matrix = get()
                if (transform) copy(matrix, transform)
            }
            scaleHelper(matrix, 1 / scaleX, 1 / scaleY)
        }

        const style = Platform.canvas.createPattern(image.getCanvas(width < 1 ? 1 : width, height < 1 ? 1 : height, opacity) as any, mode === 'repeat' ? 'repeat' : (Platform.origin.noRepeat || 'no-repeat'))

        try {
            if (paint.transform) paint.transform = null
            if (matrix) style.setTransform ? style.setTransform(matrix) : paint.transform = matrix
        } catch {
            paint.transform = matrix
        }

        paint.style = style

        return true

    } else {

        return false

    }

}