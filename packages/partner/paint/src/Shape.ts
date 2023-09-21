import { IBoundsData, ILeaferCanvas, IRenderOptions, IMatrix } from '@leafer/interface'
import { BoundsHelper } from '@leafer/core'

import { IUI, ICachedShape } from '@leafer-ui/interface'


const { getSpread, getOuterOf, getByMove, getIntersectData } = BoundsHelper

export function shape(ui: IUI, current: ILeaferCanvas, options: IRenderOptions): ICachedShape {
    const canvas = current.getSameCanvas()

    let bounds: IBoundsData, matrix: IMatrix, shapeBounds: IBoundsData
    let worldCanvas: ILeaferCanvas

    const { __world } = ui
    let { scaleX, scaleY } = __world
    if (scaleX < 0) scaleX = -scaleX
    if (scaleY < 0) scaleY = -scaleY

    if (!current.bounds.includes(__world, options.matrix)) {

        const { renderShapeSpread: spread } = ui.__layout
        const worldClipBounds = getIntersectData(spread ? getSpread(current.bounds, spread * scaleX, spread * scaleY) : current.bounds, __world, options.matrix)
        matrix = current.bounds.getFitMatrix(worldClipBounds)

        if (matrix.a < 1) {
            worldCanvas = current.getSameCanvas()
            ui.__renderShape(worldCanvas, options)

            scaleX *= matrix.a
            scaleY *= matrix.d
        }

        shapeBounds = getOuterOf(__world, matrix)
        bounds = getByMove(shapeBounds, -matrix.e, -matrix.f)

        if (options.matrix) matrix.multiply(options.matrix)
        options = { ...options, matrix }

    } else {

        if (options.matrix) {
            scaleX *= options.matrix.a
            scaleY *= options.matrix.d
            bounds = shapeBounds = getOuterOf(__world, options.matrix)
        } else {
            bounds = shapeBounds = __world
        }

        worldCanvas = canvas
    }

    ui.__renderShape(canvas, options)

    return {
        canvas, matrix, bounds,
        worldCanvas, shapeBounds, scaleX, scaleY
    }
}