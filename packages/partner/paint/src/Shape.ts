import { IBoundsData, ILeaferCanvas, IRenderOptions, IMatrix } from '@leafer/interface'
import { BoundsHelper, Matrix, Platform } from '@leafer/core'

import { IUI, ICachedShape } from '@leafer-ui/interface'


const { getSpread, getOuterOf, getByMove, getIntersectData } = BoundsHelper

export function shape(ui: IUI, current: ILeaferCanvas, options: IRenderOptions): ICachedShape {
    const canvas = current.getSameCanvas()
    const nowWorld = ui.__nowWorld, currentBounds = current.bounds

    let bounds: IBoundsData, matrix: IMatrix, fitMatrix: IMatrix, shapeBounds: IBoundsData, worldCanvas: ILeaferCanvas

    let { scaleX, scaleY } = ui.getRenderScaleData(true)

    if (currentBounds.includes(nowWorld)) {

        worldCanvas = canvas
        bounds = shapeBounds = nowWorld

    } else {

        const { renderShapeSpread: spread } = ui.__layout

        let worldClipBounds: IBoundsData // 作为绘制阴影的裁剪形状

        if (Platform.fullImageShadow) { // fix: iOS Safari 18.5 以上, 只裁剪部分区域渲染阴影会有问题
            worldClipBounds = nowWorld
        } else {
            const spreadBounds = spread ? getSpread(currentBounds, scaleX === scaleY ? spread * scaleX : [spread * scaleY, spread * scaleX]) : currentBounds
            worldClipBounds = getIntersectData(spreadBounds, nowWorld)
        }

        fitMatrix = currentBounds.getFitMatrix(worldClipBounds)
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