import { IBoundsData } from '@leafer/interface'
import { Platform, PointHelper, MatrixHelper } from '@leafer/core'

import { IGradientPaint, ILeafPaint, IMatrixData, IPointData } from '@leafer-ui/interface'

import { applyStops } from './linear'


const { set, getAngle, getDistance } = PointHelper
const { get, rotateOfOuter, scaleOfOuter } = MatrixHelper

const defaultFrom = { x: 0.5, y: 0.5 }
const defaultTo = { x: 0.5, y: 1 }

const realFrom = {} as IPointData
const realTo = {} as IPointData

export function radialGradient(paint: IGradientPaint, box: IBoundsData): ILeafPaint {

    let { from, to, type, opacity, blendMode, stretch } = paint

    from || (from = defaultFrom)
    to || (to = defaultTo)

    const { x, y, width, height } = box
    set(realFrom, x + from.x * width, y + from.y * height)
    set(realTo, x + to.x * width, y + to.y * height)

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