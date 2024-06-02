import { IObject, IBoundsData, IPointData } from '@leafer/interface'
import { AroundHelper, Platform } from '@leafer/core'

import { IGradientPaint, ILeafPaint, IColorStop, IColorString } from '@leafer-ui/interface'
import { ColorConvert } from '@leafer-ui/draw'


const { toPoint } = AroundHelper
const realFrom = {} as IPointData
const realTo = {} as IPointData

export function linearGradient(paint: IGradientPaint, box: IBoundsData): ILeafPaint {

    let { from, to, type, blendMode, opacity } = paint

    toPoint(from || 'top', box, realFrom)
    toPoint(to || 'bottom', box, realTo)

    const style = Platform.canvas.createLinearGradient(realFrom.x, realFrom.y, realTo.x, realTo.y)
    applyStops(style, paint.stops, opacity)

    const data: ILeafPaint = { type, style }
    if (blendMode) data.blendMode = blendMode
    return data

}

export function applyStops(gradient: IObject, stops: IColorStop[] | IColorString[], opacity: number): void {

    let stop: IColorStop | string
    for (let i = 0, len = stops.length; i < len; i++) {
        stop = stops[i]
        if (typeof stop === 'string') {
            gradient.addColorStop(i / (len - 1), ColorConvert.string(stop, opacity))
        } else {
            gradient.addColorStop(stop.offset, ColorConvert.string(stop.color, opacity))
        }
    }

}