import { ILeaferCanvas } from '@leafer/interface'

import { IUI, ITextRowData, ILeafPaint, IStrokeAlign, ILeafStrokePaint } from '@leafer-ui/interface'
import { PaintImage } from "@leafer-ui/draw"

import { fillText } from './FillText'


export function strokeText(stroke: string | ILeafPaint[], ui: IUI, canvas: ILeaferCanvas): void {
    const { strokeAlign } = ui.__
    const isStrokes = typeof stroke !== 'string'
    switch (strokeAlign) {
        case 'center':
            canvas.setStroke(isStrokes ? undefined : stroke, ui.__.strokeWidth, ui.__)
            isStrokes ? drawStrokesStyle(stroke as ILeafPaint[], true, ui, canvas) : drawTextStroke(ui, canvas)
            break
        case 'inside':
            drawAlignStroke('inside', stroke, isStrokes, ui, canvas)
            break
        case 'outside':
            drawAlignStroke('outside', stroke, isStrokes, ui, canvas)
            break
    }
}

function drawAlignStroke(align: IStrokeAlign, stroke: string | ILeafPaint[], isStrokes: boolean, ui: IUI, canvas: ILeaferCanvas): void {
    const { __strokeWidth, __font } = ui.__

    const out = canvas.getSameCanvas(true, true)
    out.setStroke(isStrokes ? undefined : stroke, __strokeWidth * 2, ui.__)

    out.font = __font
    isStrokes ? drawStrokesStyle(stroke as ILeafPaint[], true, ui, out) : drawTextStroke(ui, out)

    out.blendMode = align === 'outside' ? 'destination-out' : 'destination-in'
    fillText(ui, out)
    out.blendMode = 'normal'

    if (ui.__worldFlipped) {
        canvas.copyWorldByReset(out, ui.__nowWorld)
    } else {
        canvas.copyWorldToInner(out, ui.__nowWorld, ui.__layout.renderBounds)
    }

    out.recycle(ui.__nowWorld)
}

export function drawTextStroke(ui: IUI, canvas: ILeaferCanvas): void {

    let row: ITextRowData
    const { rows, decorationY, decorationHeight } = ui.__.__textDrawData

    for (let i = 0, len = rows.length; i < len; i++) {
        row = rows[i]

        if (row.text) {
            canvas.strokeText(row.text, row.x, row.y)
        } else if (row.data) {
            row.data.forEach(charData => {
                canvas.strokeText(charData.char, charData.x, row.y)
            })
        }

        if (decorationY) canvas.strokeRect(row.x, row.y + decorationY, row.width, decorationHeight)
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