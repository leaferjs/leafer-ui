import { IBoundsData, ILeaferCanvas, IRenderOptions, IMatrix } from '@leafer/interface'
import { BoundsHelper, Matrix } from '@leafer/core'

import { IUI, ICachedShape } from '@leafer-ui/interface'


const { getSpread, getOuterOf, getByMove, getIntersectData } = BoundsHelper

export function shape(ui: IUI, current: ILeaferCanvas, options: IRenderOptions): ICachedShape {
    const canvas = current.getSameCanvas()
    const nowWorld = ui.__nowWorld

    let bounds: IBoundsData, matrix: IMatrix, fitMatrix: IMatrix, shapeBounds: IBoundsData, worldCanvas: ILeaferCanvas

    let { scaleX, scaleY } = nowWorld
    if (scaleX < 0) scaleX = -scaleX
    if (scaleY < 0) scaleY = -scaleY

    if (current.bounds.includes(nowWorld)) {

        worldCanvas = canvas
        bounds = shapeBounds = nowWorld

    } else {

        const { renderShapeSpread: spread } = ui.__layout
        const worldClipBounds = getIntersectData(spread ? getSpread(current.bounds, scaleX === scaleY ? spread * scaleX : [spread * scaleY, spread * scaleX]) : current.bounds, nowWorld)
        fitMatrix = current.bounds.getFitMatrix(worldClipBounds)
        let { a: fitScaleX, d: fitScaleY } = fitMatrix

        if (fitMatrix.a < 1) {
            worldCanvas = current.getSameCanvas()
            ui.__renderShape(worldCanvas, options)

            scaleX *= fitScaleX
            scaleY *= fitScaleY
        }

        shapeBounds = getOuterOf(nowWorld, fitMatrix)
        bounds = getByMove(shapeBounds, -fitMatrix.e, -fitMatrix.f)

        const userMatrix = options.matrix
        if (userMatrix) {
            matrix = new Matrix(fitMatrix) // 仅用于渲染
            matrix.multiply(userMatrix)
            fitScaleX *= userMatrix.scaleX
            fitScaleY *= userMatrix.scaleY
        } else matrix = fitMatrix

        matrix.withScale(fitScaleX, fitScaleY)
        options = { ...options, matrix }
    }

    ui.__renderShape(canvas, options)

    return {
        canvas, matrix, fitMatrix, bounds,
        worldCanvas, shapeBounds, scaleX, scaleY
    }
}