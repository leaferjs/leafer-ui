import { IBoundsData, ILeaferCanvas, IRenderOptions, IMatrix } from '@leafer/interface'
import { BoundsHelper } from '@leafer/core'

import { IUI, ICachedShape } from '@leafer-ui/interface'


const { getSpread, getOuterOf, getByMove, getIntersectData } = BoundsHelper

export function shape(ui: IUI, current: ILeaferCanvas, options: IRenderOptions): ICachedShape {
    const canvas = current.getSameCanvas()
    const nowWorld = ui.__nowWorld

    let bounds: IBoundsData, matrix: IMatrix, shapeBounds: IBoundsData, worldCanvas: ILeaferCanvas

    let { scaleX, scaleY } = nowWorld
    if (scaleX < 0) scaleX = -scaleX
    if (scaleY < 0) scaleY = -scaleY

    if (current.bounds.includes(nowWorld)) {

        worldCanvas = canvas
        bounds = shapeBounds = nowWorld

    } else {

        const { renderShapeSpread: spread } = ui.__layout
        const worldClipBounds = getIntersectData(spread ? getSpread(current.bounds, spread * scaleX, spread * scaleY) : current.bounds, nowWorld)
        matrix = current.bounds.getFitMatrix(worldClipBounds)

        if (matrix.a < 1) {
            worldCanvas = current.getSameCanvas()
            ui.__renderShape(worldCanvas, options)

            scaleX *= matrix.a
            scaleY *= matrix.d
        }

        shapeBounds = getOuterOf(nowWorld, matrix)
        bounds = getByMove(shapeBounds, -matrix.e, -matrix.f)

        if (options.matrix) matrix.multiply(options.matrix)
        options = { ...options, matrix }

    }

    ui.__renderShape(canvas, options)

    return {
        canvas, matrix, bounds,
        worldCanvas, shapeBounds, scaleX, scaleY
    }
}