import { ITextData, ITextDrawData, ITextRowData } from '@leafer-ui/interface'


export function layoutText(drawData: ITextDrawData, style: ITextData): void {

    const { rows, bounds } = drawData
    const { __lineHeight, __baseLine, __letterSpacing, textAlign, verticalAlign, paraSpacing, textOverflow } = style

    let { x, y, width, height } = bounds, realHeight = __lineHeight * rows.length + (paraSpacing ? paraSpacing * (drawData.paraNumber - 1) : 0)
    let starY: number = __baseLine

    // verticalAlign

    if (textOverflow !== 'show' && realHeight > height) {
        realHeight = Math.max(height, __lineHeight)
        drawData.overflow = rows.length
    } else {
        switch (verticalAlign) {
            case 'middle':
                y += (height - realHeight) / 2
                break
            case 'bottom':
                y += (height - realHeight)
        }
    }
    starY += y

    // textAlign

    let row: ITextRowData, rowWidth: number

    for (let i = 0, len = rows.length; i < len; i++) {
        row = rows[i]
        row.x = x

        switch (textAlign) {
            case 'center':
                row.x += (width - row.width) / 2
                break
            case 'right':
                row.x += width - row.width
        }

        if (row.paraStart && paraSpacing && i > 0) starY += paraSpacing

        row.y = starY

        starY += __lineHeight

        if (drawData.overflow > i && starY > realHeight) {
            row.isOverflow = true
            drawData.overflow = i + 1
        }

        if (row.width < 0) { // letterSpacing < 0, like -20% -100%
            rowWidth = -row.width + row.endCharSize + __letterSpacing
            const rowX = row.x - rowWidth
            rowWidth += row.startCharSize

            if (rowX < bounds.x) bounds.x = rowX
            if (rowWidth > bounds.width) bounds.width = rowWidth
        } else {
            rowWidth = row.width
            if (__letterSpacing < 0) rowWidth -= __letterSpacing

            if (row.x < bounds.x) bounds.x = row.x
            if (rowWidth > bounds.width) bounds.width = rowWidth
        }

    }

    bounds.y = y
    bounds.height = realHeight

}