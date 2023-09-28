import { IUI, IPaint, ILeafPaint, IRGB, IBooleanMap } from '@leafer-ui/interface'
import { ColorConvert } from '@leafer-ui/core'

import { image } from "./paint/image/image"
import { linearGradient } from './paint/linear'
import { radialGradient } from "./paint/radial"
import { conicGradient } from "./paint/conic"
import { recycleImage } from './paint/image'


let recycleMap: IBooleanMap

export function compute(attrName: 'fill' | 'stroke', ui: IUI): void {
    const value: ILeafPaint[] = []
    let item: ILeafPaint
    let paints = ui.__.__input[attrName] as IPaint[]

    if (!(paints instanceof Array)) paints = [paints]

    recycleMap = recycleImage(attrName, ui.__)

    for (let i = 0, len = paints.length; i < len; i++) {
        item = getLeafPaint(attrName, paints[i], ui,)
        if (item) value.push(item)
    }

    ui.__['_' + attrName] = value.length ? value : undefined
}


function getLeafPaint(attrName: string, paint: IPaint, ui: IUI,): ILeafPaint {
    if (typeof paint !== 'object' || paint.visible === false || paint.opacity === 0) return undefined
    const { boxBounds } = ui.__layout

    switch (paint.type) {
        case 'solid':
            let { type, blendMode, color, opacity } = paint
            return { type, blendMode, style: ColorConvert.string(color, opacity) }
        case 'image':
            return image(ui, attrName, paint, boxBounds, !recycleMap || !recycleMap[paint.url])
        case 'linear':
            return linearGradient(paint, boxBounds)
        case 'radial':
            return radialGradient(paint, boxBounds)
        case 'angular':
            return conicGradient(paint, boxBounds)
        default:
            return (paint as IRGB).r ? { type: 'solid', style: ColorConvert.string(paint) } : undefined
    }
}