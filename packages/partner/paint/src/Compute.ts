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

        if (attrName === 'fill') {
            stintSet(data, '__isAlphaPixelFill', isAlphaPixel)
            stintSet(data, '__isTransparentFill', isTransparent)
        } else {
            stintSet(data, '__isAlphaPixelStroke', isAlphaPixel)
            stintSet(data, '__isTransparentStroke', isTransparent)
            stintSet(data, '__hasMultiStrokeStyle', maxChildStrokeWidth)
        }

    } else {
        data.__removePaint(attrName, false)
    }

}


function getLeafPaint(attrName: string, paint: IPaint, ui: IUI): ILeafPaint {
    if (!isObject(paint) || paint.visible === false || paint.opacity === 0) return undefined

    let leafPaint: ILeafPaint
    const { boxBounds } = ui.__layout

    switch (paint.type) {
        case 'image':
            if (!paint.url) return undefined
            leafPaint = PaintImage.image(ui, attrName, paint, boxBounds, !recycleMap || !recycleMap[paint.url])
            break
        case 'linear':
            leafPaint = PaintGradient.linearGradient(paint, boxBounds)
            break
        case 'radial':
            leafPaint = PaintGradient.radialGradient(paint, boxBounds)
            break
        case 'angular':
            leafPaint = PaintGradient.conicGradient(paint, boxBounds)
            break
        case 'solid':
            const { type, color, opacity } = paint
            leafPaint = { type, style: ColorConvert.string(color, opacity) }
            break
        default:
            if (!isUndefined((paint as IRGB).r)) leafPaint = { type: 'solid', style: ColorConvert.string(paint) }
    }

    if (leafPaint) {
        // 原始paint
        leafPaint.originPaint = paint

        // 描边样式
        if (isString(leafPaint.style) && hasTransparent(leafPaint.style)) leafPaint.isTransparent = true
        if (paint.style) {
            if (paint.style.strokeWidth === 0) return undefined
            leafPaint.strokeStyle = paint.style as IStrokeComputedStyle
        }
    }

    return leafPaint
}