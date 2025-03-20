import { Platform } from '@leafer/core'

import { ITextCharData, ITextData, ITextDrawData, ITextRowData } from '@leafer-ui/interface'


export function clipText(drawData: ITextDrawData, style: ITextData, x: number, width: number): void {
    if (!width) return

    const { rows, overflow } = drawData
    let { textOverflow } = style
    rows.splice(overflow)

    if (textOverflow && textOverflow !== 'show') {
        if (textOverflow === 'hide') textOverflow = ''
        else if (textOverflow === 'ellipsis') textOverflow = '...'

        let char: ITextCharData, charRight: number
        const ellipsisWidth = textOverflow ? Platform.canvas.measureText(textOverflow).width : 0
        const right = x + width - ellipsisWidth
        const list = style.textWrap === 'none' ? rows : [rows[overflow - 1]]

        list.forEach(row => {

            if (row.isOverflow && row.data) {

                let end = row.data.length - 1

                for (let i = end; i > -1; i--) {
                    char = row.data[i]
                    charRight = char.x + char.width
                    if (i === end && charRight < right) {
                        break
                    } else if ((charRight < right && char.char !== ' ') || !i) { // 至少保留一个文字
                        row.data.splice(i + 1)
                        row.width -= char.width
                        break
                    }
                    row.width -= char.width
                }

                row.width += ellipsisWidth
                row.data.push({ char: textOverflow, x: charRight })

                if (row.textMode) toTextChar(row)
            }


        })

    }

}

function toTextChar(row: ITextRowData): void {
    row.text = ''
    row.data.forEach(char => {
        row.text += char.char
    })
    row.data = null
}