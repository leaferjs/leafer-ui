import { IMatrixData, IPointData, IBoundsData } from '@leafer/interface'
import { Platform, PointHelper, MatrixHelper, AroundHelper } from '@leafer/core'

import { IGradientPaint, ILeafPaint } from '@leafer-ui/interface'

import { applyStops } from './linear'


const { getAngle, getDistance } = PointHelper
const { get, rotateOfOuter, scaleOfOuter } = MatrixHelper

const { toPoint } = AroundHelper
const realFrom = {} as IPointData
const realTo = {} as IPointData

export function conicGradient(paint: IGradientPaint, box: IBoundsData): ILeafPaint {

    let { from, to, type, opacity, blendMode, stretch } = paint

    toPoint(from || 'center', box, realFrom)
    toPoint(to || 'bottom', box, realTo)

    const { width, height } = box
    const transform: IMatrixData = get()
    const angle = getAngle(realFrom, realTo)

    if (Platform.conicGradientRotate90) {
        scaleOfOuter(transform, realFrom, width / height * (stretch || 1), 1)
        rotateOfOuter(transform, realFrom, angle + 90)
    } else {
        scaleOfOuter(transform, realFrom, 1, width / height * (stretch || 1))
        rotateOfOuter(transform, realFrom, angle)
    }

    const style = Platform.conicGradientSupport ? Platform.canvas.createConicGradient(0, realFrom.x, realFrom.y) : Platform.canvas.createRadialGradient(realFrom.x, realFrom.y, 0, realFrom.x, realFrom.y, getDistance(realFrom, realTo))
    applyStops(style, paint.stops, opacity)

    const data: ILeafPaint = { type, style, transform }
    if (blendMode) data.blendMode = blendMode
    return data

}