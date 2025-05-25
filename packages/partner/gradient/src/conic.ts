import { IPointData, IBoundsData } from '@leafer/interface'
import { Platform, PointHelper, AroundHelper } from '@leafer/core'

import { IGradientPaint, ILeafPaint } from '@leafer-ui/interface'

import { applyStops } from './linear'
import { getTransform } from './radial'


const { getDistance } = PointHelper

const { toPoint } = AroundHelper
const realFrom = {} as IPointData
const realTo = {} as IPointData

export function conicGradient(paint: IGradientPaint, box: IBoundsData): ILeafPaint {

    let { from, to, type, opacity, stretch } = paint

    toPoint(from || 'center', box, realFrom)
    toPoint(to || 'bottom', box, realTo)

    const style = Platform.conicGradientSupport ? Platform.canvas.createConicGradient(0, realFrom.x, realFrom.y) : Platform.canvas.createRadialGradient(realFrom.x, realFrom.y, 0, realFrom.x, realFrom.y, getDistance(realFrom, realTo))
    const data: ILeafPaint = { type, style }

    applyStops(data, style, paint.stops, opacity)

    const transform = getTransform(box, realFrom, realTo, stretch || 1, Platform.conicGradientRotate90)
    if (transform) data.transform = transform

    return data

}