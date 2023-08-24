import { ILeaferCanvas } from '@leafer/interface'

import { IUI, ITextRowData, ILeafPaint, IStrokeAlign, ILeafStrokePaint } from '@leafer-ui/interface'

import { fillText } from './FillText'
import { checkImage } from './paint/image'


export function strokeText(ui: IUI, canvas: ILeaferCanvas, stroke: string | ILeafPaint[]): void {
    const { strokeAlign } = ui.__
    const isStrokes = typeof stroke !== 'string'
    switch (strokeAlign) {
        case 'center':
            canvas.setStroke(isStrokes ? undefined : stroke, ui.__.strokeWidth, ui.__)
            isStrokes ? drawStrokesStyle(ui, stroke as ILeafPaint[], canvas, true) : drawTextStroke(ui, canvas)
            break
        case 'inside':
            drawAlignStroke(ui, canvas, stroke, 'inside', isStrokes)
            break
        case 'outside':
            drawAlignStroke(ui, canvas, stroke, 'outside', isStrokes)
            break
    }
}

function drawAlignStroke(ui: IUI, canvas: ILeaferCanvas, stroke: string | ILeafPaint[], align: IStrokeAlign, isStrokes?: boolean): void {
    const { strokeWidth, __font } = ui.__

    const out = canvas.getSameCanvas(true)
    out.setStroke(isStrokes ? undefined : stroke, strokeWidth * 2, ui.__)

    out.font = __font
    isStrokes ? drawStrokesStyle(ui, stroke as ILeafPaint[], out, true) : drawTextStroke(ui, out)

    out.blendMode = align === 'outside' ? 'destination-out' : 'destination-in'
    fillText(ui, out)
    out.blendMode = 'normal'

    canvas.copyWorldToInner(out, ui.__world, ui.__layout.renderBounds)
    out.recycle()
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

export function drawStrokesStyle(ui: IUI, strokes: ILeafStrokePaint[], canvas: ILeaferCanvas, isText?: boolean): void {
    let item: ILeafStrokePaint
    for (let i = 0, len = strokes.length; i < len; i++) {
        item = strokes[i]

        if (item.style) {

            if (item.image && checkImage(ui, canvas, item, false)) continue

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