import { ILeaferCanvas, IRenderOptions } from '@leafer/interface'

import { ITextRowData, IText } from '@leafer-ui/interface'

import { Paint } from '@leafer-ui/draw'


export function fillText(ui: IText, canvas: ILeaferCanvas, renderOptions: IRenderOptions, complexPaint?: boolean): void {

    const data = ui.__
    if (data.__isPlacehold && data.placeholderColor) canvas.fillStyle = data.placeholderColor

    let originCanvas: ILeaferCanvas

    if (complexPaint) {
        originCanvas = canvas
        canvas = canvas.getSameCanvas(true, true)
        canvas.font = ui.__.__font
        canvas.fillStyle = '#000'
    }

    if (ui.motionText) {

        Paint.fillMotionText(ui, canvas, renderOptions)

    } else {

        let row: ITextRowData
        const { rows, decorationY } = data.__textDrawData

        for (let i = 0, len = rows.length; i < len; i++) {
            row = rows[i]

            if (row.text) canvas.fillText(row.text, row.x, row.y)
            else if (row.data) row.data.forEach(charData => { canvas.fillText(charData.char, charData.x, row.y) })
        }

        if (decorationY) {
            const { decorationColor, decorationHeight } = data.__textDrawData
            if (decorationColor) canvas.fillStyle = decorationColor
            rows.forEach(row => decorationY.forEach(value => canvas.fillRect(row.x, row.y + value, row.width, decorationHeight)))
        }

    }

    if (complexPaint) {
        canvas.beginPath()
        ui.__drawPathByBox(canvas, 'render')

        canvas.fillStyle = originCanvas.fillStyle
        canvas.setTransform(originCanvas.getTransform())
        canvas.blendMode = 'source-in'
        canvas.fill()

        originCanvas.copyWorldByReset(canvas, ui.__nowWorld)
        canvas.recycle(ui.__nowWorld)
    }
}
