import { ILeaferCanvas, IRenderOptions } from '@leafer/interface'

import { ITextRowData, IText } from '@leafer-ui/interface'

import { Paint } from '@leafer-ui/draw'


export function fillText(ui: IText, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void {

    if (ui.motionText) return Paint.fillMotionText(ui, canvas, renderOptions)

    const data = ui.__, { rows, decorationY } = data.__textDrawData
    if (data.__isPlacehold && data.placeholderColor) canvas.fillStyle = data.placeholderColor

    let row: ITextRowData

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
