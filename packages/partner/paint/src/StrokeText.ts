import { ILeaferCanvas } from '@leafer/interface'
import { LeafHelper } from "@leafer/core"

import { IUI, ITextRowData, ILeafPaint, IStrokeAlign, ILeafStrokePaint } from '@leafer-ui/interface'
import { PaintImage } from "@leafer-ui/draw"

import { fillText } from './FillText'


export function strokeText(stroke: string | ILeafPaint[], ui: IUI, canvas: ILeaferCanvas): void {
    switch (ui.__.strokeAlign) {
        case 'center':
            drawCenter(stroke, 1, ui, canvas)
            break
        case 'inside':
            drawAlign(stroke, 'inside', ui, canvas)
            break
        case 'outside':
            ui.__.__fillAfterStroke ? drawCenter(stroke, 2, ui, canvas) : drawAlign(stroke, 'outside', ui, canvas)
            break
    }
}

function drawCenter(stroke: string | ILeafPaint[], strokeWidthScale: number, ui: IUI, canvas: ILeaferCanvas): void {
    const data = ui.__
    canvas.setStroke(!data.__isStrokes && stroke as string, data.strokeWidth * strokeWidthScale, data)
    data.__isStrokes ? drawStrokesStyle(stroke as ILeafPaint[], true, ui, canvas) : drawTextStroke(ui, canvas)
}

function drawAlign(stroke: string | ILeafPaint[], align: IStrokeAlign, ui: IUI, canvas: ILeaferCanvas): void {
    const out = canvas.getSameCanvas(true, true)
    out.font = ui.__.__font
    drawCenter(stroke, 2, ui, out)

    out.blendMode = align === 'outside' ? 'destination-out' : 'destination-in'
    fillText(ui, out)
    out.blendMode = 'normal'

    LeafHelper.copyCanvasByWorld(ui, canvas, out)

    out.recycle(ui.__nowWorld)
}


export function drawTextStroke(ui: IUI, canvas: ILeaferCanvas): void {

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

export function drawStrokesStyle(strokes: ILeafStrokePaint[], isText: boolean, ui: IUI, canvas: ILeaferCanvas): void {
    let item: ILeafStrokePaint
    for (let i = 0, len = strokes.length; i < len; i++) {
        item = strokes[i]

        if (item.image && PaintImage.checkImage(ui, canvas, item, false)) continue

        if (item.style) {
            canvas.strokeStyle = item.style

            if (item.blendMode) {
                canvas.saveBlendMode(item.blendMode)
                isText ? drawTextStroke(ui, canvas) : canvas.stroke()
                canvas.restoreBlendMode()
            } else {
                isText ? drawTextStroke(ui, canvas) : canvas.stroke()
            }
        }
    }
}