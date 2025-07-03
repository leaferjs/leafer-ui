import { IObject, IBoundsData, IPointData } from '@leafer/interface'
import { AroundHelper, Platform, isString } from '@leafer/core'

import { IGradientPaint, ILeafPaint, IColorStop, IColorString } from '@leafer-ui/interface'
import { ColorConvert } from '@leafer-ui/draw'


const { toPoint } = AroundHelper, { hasTransparent } = ColorConvert
const realFrom = {} as IPointData
const realTo = {} as IPointData

export function linearGradient(paint: IGradientPaint, box: IBoundsData): ILeafPaint {

    let { from, to, type, opacity } = paint

    toPoint(from || 'top', box, realFrom)
    toPoint(to || 'bottom', box, realTo)

    const style = Platform.canvas.createLinearGradient(realFrom.x, realFrom.y, realTo.x, realTo.y)
    const data: ILeafPaint = { type, style }

    applyStops(data, style, paint.stops, opacity)

    return data

}

export function applyStops(data: ILeafPaint, gradient: IObject, stops: IColorStop[] | IColorString[], opacity: number): void {
    if (stops) {
        let stop: IColorStop | string, color: string, offset: number, isTransparent: boolean
        for (let i = 0, len = stops.length; i < len; i++) {
            stop = stops[i]
            if (isString(stop)) offset = i / (len - 1), color = ColorConvert.string(stop, opacity)
            else offset = stop.offset, color = ColorConvert.string(stop.color, opacity)
            gradient.addColorStop(offset, color)
            if (!isTransparent && hasTransparent(color)) isTransparent = true
        }
        if (isTransparent) data.isTransparent = true
    }
}