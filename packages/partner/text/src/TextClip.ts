import { Platform } from '@leafer/core'

import { IOverflow, ITextCharData, ITextDrawData } from '@leafer-ui/interface'


export function clipText(drawData: ITextDrawData, textOverflow: IOverflow | string): void {

    const { rows, overflow } = drawData
    rows.splice(overflow)

    if (textOverflow !== 'hide') {
        if (textOverflow === 'ellipsis') textOverflow = '...'

        const ellipsisWidth = Platform.canvas.measureText(textOverflow).width
        const row = rows[overflow - 1]

        let char: ITextCharData, end = row.data.length - 1, charRight: number

        const { x, width } = drawData.bounds
        const right = x + width - ellipsisWidth

        for (let i = end; i > -1; i--) {
            char = row.data[i]
            charRight = char.x + char.width
            if (i === end && charRight < right) {
                break
            } else if (charRight < right && char.char !== ' ') {
                row.data.splice(i + 1)
                row.width -= char.width
                break
            }
            row.width -= char.width
        }

        row.width += ellipsisWidth
        row.data.push({ char: textOverflow, x: charRight })
    }

}