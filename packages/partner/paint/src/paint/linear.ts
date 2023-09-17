import { IObject, IBoundsData } from '@leafer/interface'
import { Platform } from '@leafer/core'

import { IGradientPaint, ILeafPaint, IColorStop } from '@leafer-ui/interface'
import { ColorConvert } from '@leafer-ui/core'


const defaultFrom = { x: 0.5, y: 0 }
const defaultTo = { x: 0.5, y: 1 }

export function linearGradient(paint: IGradientPaint, box: IBoundsData): ILeafPaint {

    let { from, to, type, blendMode, opacity } = paint

    from || (from = defaultFrom)
    to || (to = defaultTo)

    const style = Platform.canvas.createLinearGradient(box.x + from.x * box.width, box.y + from.y * box.height, box.x + to.x * box.width, box.y + to.y * box.height)
    applyStops(style, paint.stops, opacity)

    const data: ILeafPaint = { type, style }
    if (blendMode) data.blendMode = blendMode
    return data

}

export function applyStops(gradient: IObject, stops: IColorStop[], opacity: number): void {
    let stop: IColorStop
    for (let i = 0, len = stops.length; i < len; i++) {
        stop = stops[i]
        gradient.addColorStop(stop.offset, ColorConvert.string(stop.color, opacity))
    }
}