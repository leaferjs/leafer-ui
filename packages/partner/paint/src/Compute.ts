import { DataHelper, isArray, isObject, isString, isUndefined } from '@leafer/core'

import { IUI, IPaint, ILeafPaint, IRGB, IBooleanMap, IObject, IPaintAttr, IStrokeComputedStyle } from '@leafer-ui/interface'
import { ColorConvert, PaintImage, PaintGradient } from '@leafer-ui/draw'


let recycleMap: IBooleanMap
const { stintSet } = DataHelper, { hasTransparent } = ColorConvert

export function compute(attrName: IPaintAttr, ui: IUI): void {
    const data = ui.__, leafPaints: ILeafPaint[] = []

    let paints: IPaint[] = data.__input[attrName], isAlphaPixel: boolean, isTransparent: boolean
    if (!isArray(paints)) paints = [paints]

    recycleMap = PaintImage.recycleImage(attrName, data)

    let maxChildStrokeWidth: number

    for (let i = 0, len = paints.length, item: ILeafPaint; i < len; i++) {
        if (item = getLeafPaint(attrName, paints[i], ui)) {
            leafPaints.push(item)

            // 检测多个子描边样式和宽度
            if (item.strokeStyle) {
                maxChildStrokeWidth || (maxChildStrokeWidth = 1)
                if (item.strokeStyle.strokeWidth) maxChildStrokeWidth = Math.max(maxChildStrokeWidth, item.strokeStyle.strokeWidth as number)
            }
        }
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
        stintSet(data, '__hasMultiStrokeStyle', maxChildStrokeWidth)
    }
}


function getLeafPaint(attrName: string, paint: IPaint, ui: IUI): ILeafPaint {
    if (!isObject(paint) || paint.visible === false || paint.opacity === 0) return undefined

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
            const { type, color, opacity } = paint
            data = { type, style: ColorConvert.string(color, opacity) }
            break
        default:
            if (!isUndefined((paint as IRGB).r)) data = { type: 'solid', style: ColorConvert.string(paint) }
    }

    if (data) {
        // 描边样式
        if (isString(data.style) && hasTransparent(data.style)) data.isTransparent = true
        if (paint.style) {
            if (paint.style.strokeWidth === 0) return undefined
            data.strokeStyle = paint.style as IStrokeComputedStyle
        }

        if (paint.editing) data.editing = paint.editing
        if (paint.blendMode) data.blendMode = paint.blendMode
    }

    return data
}