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

    let { from, to, type, opacity, stretch } = paint

    toPoint(from || 'center', box, realFrom)
    toPoint(to || 'bottom', box, realTo)

    const style = Platform.canvas.createRadialGradient(realFrom.x, realFrom.y, 0, realFrom.x, realFrom.y, getDistance(realFrom, realTo))
    const data: ILeafPaint = { type, style }

    applyStops(data, style, paint.stops, opacity)

    const transform = getTransform(box, realFrom, realTo, stretch, true)
    if (transform) data.transform = transform

    return data

}

export function getTransform(box: IBoundsData, from: IPointData, to: IPointData, stretch: number, rotate90: boolean): IMatrixData {
    let transform: IMatrixData
    const { width, height } = box

    if (width !== height || stretch) {
        const angle = getAngle(from, to)
        transform = get()
        if (rotate90) {
            scaleOfOuter(transform, from, width / height * (stretch || 1), 1)
            rotateOfOuter(transform, from, angle + 90)
        } else {
            scaleOfOuter(transform, from, 1, width / height * (stretch || 1))
            rotateOfOuter(transform, from, angle)
        }
    }

    return transform
}