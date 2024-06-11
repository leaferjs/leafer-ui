import { IUI, IPaint, ILeafPaint, IRGB, IBooleanMap, IObject, IPaintAttr } from '@leafer-ui/interface'
import { ColorConvert, PaintImage, PaintGradient } from '@leafer-ui/draw'


let recycleMap: IBooleanMap

export function compute(attrName: IPaintAttr, ui: IUI): void {
    const data = ui.__, leafPaints: ILeafPaint[] = []

    let paints: IPaint[] = data.__input[attrName], hasOpacityPixel: boolean
    if (!(paints instanceof Array)) paints = [paints]

    recycleMap = PaintImage.recycleImage(attrName, data)

    for (let i = 0, len = paints.length, item: ILeafPaint; i < len; i++) {
        item = getLeafPaint(attrName, paints[i], ui)
        if (item) leafPaints.push(item)
    }

    (data as IObject)['_' + attrName] = leafPaints.length ? leafPaints : undefined

    if (leafPaints.length && leafPaints[0].image) hasOpacityPixel = leafPaints[0].image.hasOpacityPixel

    if (attrName === 'fill') {
        data.__pixelFill = hasOpacityPixel
    } else {
        data.__pixelStroke = hasOpacityPixel
    }
}


function getLeafPaint(attrName: string, paint: IPaint, ui: IUI): ILeafPaint {
    if (typeof paint !== 'object' || paint.visible === false || paint.opacity === 0) return undefined
    const { boxBounds } = ui.__layout

    switch (paint.type) {
        case 'solid':
            let { type, blendMode, color, opacity } = paint
            return { type, blendMode, style: ColorConvert.string(color, opacity) }
        case 'image':
            return PaintImage.image(ui, attrName, paint, boxBounds, !recycleMap || !recycleMap[paint.url])
        case 'linear':
            return PaintGradient.linearGradient(paint, boxBounds)
        case 'radial':
            return PaintGradient.radialGradient(paint, boxBounds)
        case 'angular':
            return PaintGradient.conicGradient(paint, boxBounds)
        default:
            return (paint as IRGB).r !== undefined ? { type: 'solid', style: ColorConvert.string(paint) } : undefined
    }
}