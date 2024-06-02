import { IBoundsData } from '@leafer/interface'
import { Platform, PointHelper, MatrixHelper, AroundHelper } from '@leafer/core'

import { IGradientPaint, ILeafPaint, IMatrixData, IPointData } from '@leafer-ui/interface'

import { applyStops } from './linear'


const { getAngle, getDistance } = PointHelper
const { get, rotateOfOuter, scaleOfOuter } = MatrixHelper

const { toPoint } = AroundHelper
const realFrom = {} as IPointData
const realTo = {} as IPointData

export function radialGradient(paint: IGradientPaint, box: IBoundsData): ILeafPaint {

    let { from, to, type, opacity, blendMode, stretch } = paint

    toPoint(from || 'center', box, realFrom)
    toPoint(to || 'bottom', box, realTo)

    const { width, height } = box
    let transform: IMatrixData

    if (width !== height || stretch) {
        transform = get()
        scaleOfOuter(transform, realFrom, width / height * (stretch || 1), 1)
        rotateOfOuter(transform, realFrom, getAngle(realFrom, realTo) + 90)
    }

    const style = Platform.canvas.createRadialGradient(realFrom.x, realFrom.y, 0, realFrom.x, realFrom.y, getDistance(realFrom, realTo))
    applyStops(style, paint.stops, opacity)

    const data: ILeafPaint = { type, style, transform }
    if (blendMode) data.blendMode = blendMode
    return data

}