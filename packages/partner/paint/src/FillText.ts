import { ILeaferCanvas } from '@leafer/interface'

import { IUI, ITextRowData } from '@leafer-ui/interface'


export function fillText(ui: IUI, canvas: ILeaferCanvas): void {

    let row: ITextRowData
    const { rows, decorationY, decorationHeight } = ui.__.__textDrawData

    for (let i = 0, len = rows.length; i < len; i++) {
        row = rows[i]

        if (row.text) {
            canvas.fillText(row.text, row.x, row.y)
        } else if (row.data) {
            row.data.forEach(charData => {
                canvas.fillText(charData.char, charData.x, row.y)
            })
        }

        if (decorationY) canvas.fillRect(row.x, row.y + decorationY, row.width, decorationHeight)
    }

}
