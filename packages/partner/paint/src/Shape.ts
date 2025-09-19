import { IBoundsData, ILeaferCanvas, IRenderOptions, IMatrix } from '@leafer/interface'
import { BoundsHelper, FourNumberHelper, Matrix, Platform } from '@leafer/core'

import { IUI, ICachedShape } from '@leafer-ui/interface'


const { getSpread, copyAndSpread, toOuterOf, getOuterOf, getByMove, move, getIntersectData } = BoundsHelper
const tempBounds = {} as IBoundsData

export function shape(ui: IUI, current: ILeaferCanvas, options: IRenderOptions): ICachedShape {
    const canvas = current.getSameCanvas()
    const currentBounds = current.bounds, nowWorld = ui.__nowWorld, layout = ui.__layout
    const nowWorldShapeBounds = ui.__nowWorldShapeBounds || (ui.__nowWorldShapeBounds = {} as IBoundsData)

    toOuterOf(layout.strokeSpread ? (copyAndSpread(tempBounds, layout.boxBounds, layout.strokeSpread), tempBounds) : layout.boxBounds, nowWorld, nowWorldShapeBounds)

    let bounds: IBoundsData, renderBounds: IBoundsData, matrix: IMatrix, fitMatrix: IMatrix, shapeBounds: IBoundsData, worldCanvas: ILeaferCanvas

    let { scaleX, scaleY } = ui.getRenderScaleData(true)

    if (currentBounds.includes(nowWorldShapeBounds)) {

        worldCanvas = canvas
        bounds = shapeBounds = nowWorldShapeBounds
        renderBounds = nowWorld

    } else {

        let worldClipBounds: IBoundsData // 作为绘制阴影的裁剪形状

        if (Platform.fullImageShadow) { // fix: iOS Safari 18.5 以上, 只裁剪部分区域渲染阴影会有问题
            worldClipBounds = nowWorldShapeBounds
        } else {

            const spreadBounds = layout.renderShapeSpread ? getSpread(currentBounds, FourNumberHelper.swapAndScale(layout.renderShapeSpread, scaleX, scaleY)) : currentBounds  // spread需要反向交换值
            worldClipBounds = getIntersectData(spreadBounds, nowWorldShapeBounds)
        }

        fitMatrix = currentBounds.getFitMatrix(worldClipBounds)
        let { a: fitScaleX, d: fitScaleY } = fitMatrix

        if (fitMatrix.a < 1) {
            worldCanvas = current.getSameCanvas()
            ui.__renderShape(worldCanvas, options)

            scaleX *= fitScaleX
            scaleY *= fitScaleY
        }


        shapeBounds = getOuterOf(nowWorldShapeBounds, fitMatrix)
        bounds = getByMove(shapeBounds, -fitMatrix.e, -fitMatrix.f)

        renderBounds = getOuterOf(nowWorld, fitMatrix)
        move(renderBounds, -fitMatrix.e, -fitMatrix.f)


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
        canvas, matrix, fitMatrix, bounds, renderBounds,
        worldCanvas, shapeBounds, scaleX, scaleY
    }
}