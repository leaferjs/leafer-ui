import { ILeaferCanvas } from '@leafer/interface'

import { IUI, ITextRowData, ILeafStrokePaint, ILeafPaint, IStrokeAlign } from '@leafer-ui/interface'

import { drawText } from './FillText'


export function strokeText(ui: IUI, canvas: ILeaferCanvas, stroke: string | object): void {
    const { strokeAlign } = ui.__
    switch (strokeAlign) {
        case 'center':
            canvas.setStroke(stroke, ui.__.strokeWidth, ui.__)
            drawTextStroke(ui, canvas)
            break
        case 'inside':
            drawAlignStroke(ui, canvas, stroke, 'inside')
            break
        case 'outside':
            drawAlignStroke(ui, canvas, stroke, 'outside')
            break
    }
}

function drawAlignStroke(ui: IUI, canvas: ILeaferCanvas, stroke: string | object, align: IStrokeAlign): void {
    const { strokeWidth, __font } = ui.__

    const out = canvas.getSameCanvas(true)
    out.setStroke(stroke, strokeWidth * 2, ui.__)

    out.font = __font
    drawTextStroke(ui, out)

    out.blendMode = align === 'outside' ? 'destination-out' : 'destination-in'
    drawText(ui, out)
    out.blendMode = 'normal'

    canvas.copyWorldToInner(out, ui.__world, ui.__layout.renderBounds)
    out.recycle()
}

export function strokesText(ui: IUI, canvas: ILeaferCanvas, strokes: ILeafPaint[]): void {
    const { strokeAlign } = ui.__
    switch (strokeAlign) {
        case 'center':
            canvas.setStroke(undefined, ui.__.strokeWidth, ui.__)
            drawStrokesStyle(ui, strokes, canvas)
            break
        case 'inside':
            drawAlignStroke(ui, canvas, strokes, 'inside')
            break
        case 'outside':
            drawAlignStrokes(ui, canvas, strokes, 'outside')
            break
    }
}


function drawAlignStrokes(ui: IUI, canvas: ILeaferCanvas, strokes: ILeafPaint[], align: IStrokeAlign): void {
    const { strokeWidth, __font } = ui.__

    const out = canvas.getSameCanvas(true)
    out.setStroke(undefined, strokeWidth * 2, ui.__)

    out.font = __font
    drawStrokesStyle(ui, strokes, out)

    out.blendMode = align === 'outside' ? 'destination - out' : 'destination -in '
    drawText(ui, out)
    out.blendMode = 'normal'

    canvas.copyWorldToInner(out, ui.__world, ui.__layout.renderBounds)
    out.recycle()
}


function drawStrokesStyle(ui: IUI, strokes: ILeafStrokePaint[], canvas: ILeaferCanvas): void {
    strokes.forEach((item: ILeafStrokePaint) => {
        canvas.strokeStyle = item.style

        if (item.blendMode) {
            canvas.saveBlendMode(item.blendMode)
            drawTextStroke(ui, canvas)
            canvas.restoreBlendMode()
        } else {
            drawTextStroke(ui, canvas)
        }

    })
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
