import { DataHelper } from '@leafer/core'

import { IUI, IPaint, ILeafPaint, IRGB, IBooleanMap, IObject, IPaintAttr } from '@leafer-ui/interface'
import { ColorConvert, PaintImage, PaintGradient } from '@leafer-ui/draw'


let recycleMap: IBooleanMap
const { stintSet } = DataHelper, { hasTransparent } = ColorConvert

export function compute(attrName: IPaintAttr, ui: IUI): void {
    const data = ui.__, leafPaints: ILeafPaint[] = []

    let paints: IPaint[] = data.__input[attrName], isAlphaPixel: boolean, isTransparent: boolean
    if (!(paints instanceof Array)) paints = [paints]

    recycleMap = PaintImage.recycleImage(attrName, data)

    for (let i = 0, len = paints.length, item: ILeafPaint; i < len; i++) {
        item = getLeafPaint(attrName, paints[i], ui)
        if (item) leafPaints.push(item)
    }

    (data as IObject)['_' + attrName] = leafPaints.length ? leafPaints : undefined

    if (leafPaints.length) {
        if (leafPaints.every(item => item.isTransparent)) {
            if (leafPaints.some(item => item.image)) isAlphaPixel = true
            isTransparent = true
        }
    }

    if (attrName === 'fill') {
        stintSet(data, '__isAlphaPixelFill', isAlphaPixel)
        stintSet(data, '__isTransparentFill', isTransparent)
    } else {
        stintSet(data, '__isAlphaPixelStroke', isAlphaPixel)
        stintSet(data, '__isTransparentStroke', isTransparent)
    }
}


function getLeafPaint(attrName: string, paint: IPaint, ui: IUI): ILeafPaint {
    if (typeof paint !== 'object' || paint.visible === false || paint.opacity === 0) return undefined

    let data: ILeafPaint
    const { boxBounds } = ui.__layout

    switch (paint.type) {
        case 'image':
            data = PaintImage.image(ui, attrName, paint, boxBounds, !recycleMap || !recycleMap[paint.url])
            break
        case 'linear':
            data = PaintGradient.linearGradient(paint, boxBounds)
            break
        case 'radial':
            data = PaintGradient.radialGradient(paint, boxBounds)
            break
        case 'angular':
            data = PaintGradient.conicGradient(paint, boxBounds)
            break
        case 'solid':
            const { type, blendMode, color, opacity } = paint
            data = { type, blendMode, style: ColorConvert.string(color, opacity) }
            break
        default:
            if ((paint as IRGB).r !== undefined) data = { type: 'solid', style: ColorConvert.string(paint) }
    }

    if (data) {
        if (typeof data.style === 'string' && hasTransparent(data.style)) data.isTransparent = true
        if (paint.blendMode) data.blendMode = paint.blendMode
    }

    return data
}