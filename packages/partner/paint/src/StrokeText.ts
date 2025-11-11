import { ILeaferCanvas, IRenderOptions } from '@leafer/interface'
import { LeafHelper, isObject } from "@leafer/core"

import { IUI, ITextRowData, ILeafPaint, IStrokeAlign, ILeafStrokePaint } from '@leafer-ui/interface'
import { PaintImage, Paint } from "@leafer-ui/draw"


export function strokeText(stroke: string | ILeafPaint[], ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void {
    switch (ui.__.strokeAlign) {
        case 'center':
            drawCenter(stroke, 1, ui, canvas, renderOptions)
            break
        case 'inside':
            drawAlign(stroke, 'inside', ui, canvas, renderOptions)
            break
        case 'outside':
            ui.__.__fillAfterStroke ? drawCenter(stroke, 2, ui, canvas, renderOptions) : drawAlign(stroke, 'outside', ui, canvas, renderOptions)
            break
    }
}

function drawCenter(stroke: string | ILeafPaint[], strokeWidthScale: number, ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void {
    const data = ui.__
    if (isObject(stroke)) {
        Paint.drawStrokesStyle(stroke, strokeWidthScale, true, ui, canvas, renderOptions)
    } else {
        canvas.setStroke(stroke, data.__strokeWidth * strokeWidthScale, data)
        Paint.drawTextStroke(ui, canvas, renderOptions)
    }
}

function drawAlign(stroke: string | ILeafPaint[], align: IStrokeAlign, ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void {
    const out = canvas.getSameCanvas(true, true)
    out.font = ui.__.__font
    drawCenter(stroke, 2, ui, out, renderOptions)

    out.blendMode = align === 'outside' ? 'destination-out' : 'destination-in'
    Paint.fillText(ui, out, renderOptions)
    out.blendMode = 'normal'

    LeafHelper.copyCanvasByWorld(ui, canvas, out)

    out.recycle(ui.__nowWorld)
}


export function drawTextStroke(ui: IUI, canvas: ILeaferCanvas, _renderOptions: IRenderOptions): void {

    let row: ITextRowData, data = ui.__.__textDrawData
    const { rows, decorationY } = data

    for (let i = 0, len = rows.length; i < len; i++) {
        row = rows[i]

        if (row.text) canvas.strokeText(row.text, row.x, row.y)
        else if (row.data) row.data.forEach(charData => { canvas.strokeText(charData.char, charData.x, row.y) })
    }

    if (decorationY) {
        const { decorationHeight } = data
        rows.forEach(row => decorationY.forEach(value => canvas.strokeRect(row.x, row.y + value, row.width, decorationHeight)))
    }

}

export function drawStrokesStyle(strokes: ILeafStrokePaint[], strokeWidthScale: number, isText: boolean, ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void {
    let item: ILeafStrokePaint
    const data = ui.__, { __hasMultiStrokeStyle } = data
    __hasMultiStrokeStyle || canvas.setStroke(undefined, data.__strokeWidth * strokeWidthScale, data)

    for (let i = 0, len = strokes.length; i < len; i++) {
        item = strokes[i]

        if (item.image && PaintImage.checkImage(item, false, ui, canvas, renderOptions)) continue

        if (item.style) {
            if (__hasMultiStrokeStyle) {
                const { strokeStyle } = item
                strokeStyle ? canvas.setStroke(item.style, data.__getRealStrokeWidth(strokeStyle) * strokeWidthScale, data, strokeStyle) : canvas.setStroke(item.style, data.__strokeWidth * strokeWidthScale, data)
            } else canvas.strokeStyle = item.style

            if (item.originPaint.blendMode) {
                canvas.saveBlendMode(item.originPaint.blendMode)
                isText ? Paint.drawTextStroke(ui, canvas, renderOptions) : canvas.stroke()
                canvas.restoreBlendMode()
            } else {
                isText ? Paint.drawTextStroke(ui, canvas, renderOptions) : canvas.stroke()
            }
        }
    }
}