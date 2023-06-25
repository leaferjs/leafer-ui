import { IUI, IPaint, ILeafPaint, IRGB } from '@leafer-ui/interface'
import { ColorConvert } from '@leafer-ui/color'

import { image } from "./paint/image"
import { linearGradient } from './paint/linear'
import { radialGradient } from "./paint/radial"
import { conicGradient } from "./paint/conic"


export function computeFill(ui: IUI): void {
    compute(ui, 'fill')
}

export function computeStroke(ui: IUI): void {
    compute(ui, 'stroke')
}

function compute(ui: IUI, attrName: string): void {
    let paints = ui.__.__input[attrName] as IPaint[]

    let item: ILeafPaint
    const value: ILeafPaint[] = []
    if (!(paints instanceof Array)) paints = [paints]

    for (let i = 0, len = paints.length; i < len; i++) {
        item = getLeafPaint(ui, paints[i], attrName)
        if (item) value.push(item)
    }
    ui.__['_' + attrName] = value.length ? value : undefined
}

function getLeafPaint(ui: IUI, paint: IPaint, attrName: string): ILeafPaint {
    if (typeof paint !== 'object' || paint.visible === false || paint.opacity === 0) return undefined
    const { boxBounds } = ui.__layout

    switch (paint.type) {
        case 'solid':
            let { type, blendMode, color, opacity } = paint
            return { type, blendMode, style: ColorConvert.string(color, opacity) }
        case 'image':
            return image(ui, attrName, paint, boxBounds)
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