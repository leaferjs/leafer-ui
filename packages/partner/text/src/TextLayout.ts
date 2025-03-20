import { ITextData, ITextDrawData, ITextRowData } from '@leafer-ui/interface'


export function layoutText(drawData: ITextDrawData, style: ITextData): void {

    const { rows, bounds } = drawData, countRows = rows.length
    const { __lineHeight, __baseLine, __letterSpacing, __clipText, textAlign, verticalAlign, paraSpacing, autoSizeAlign } = style

    let { x, y, width, height } = bounds, realHeight = __lineHeight * countRows + (paraSpacing ? paraSpacing * (drawData.paraNumber - 1) : 0)
    let starY: number = __baseLine

    // verticalAlign

    if (__clipText && realHeight > height) {
        realHeight = Math.max(height, __lineHeight)
        if (countRows > 1) drawData.overflow = countRows
    } else if (height || autoSizeAlign) {
        switch (verticalAlign) {
            case 'middle': y += (height - realHeight) / 2; break
            case 'bottom': y += (height - realHeight)
        }
    }
    starY += y

    // textAlign

    let row: ITextRowData, rowX: number, rowWidth: number, layoutWidth = (width || autoSizeAlign) ? width : drawData.maxWidth

    for (let i = 0, len = countRows; i < len; i++) {
        row = rows[i]
        row.x = x

        if (row.width < width || (row.width > width && !__clipText)) {
            switch (textAlign) {
                case 'center': row.x += (layoutWidth - row.width) / 2; break
                case 'right': row.x += layoutWidth - row.width
            }
        }

        if (row.paraStart && paraSpacing && i > 0) starY += paraSpacing

        row.y = starY

        starY += __lineHeight

        if (drawData.overflow > i && starY > realHeight) {
            row.isOverflow = true
            drawData.overflow = i + 1
        }

        rowX = row.x
        rowWidth = row.width

        if (__letterSpacing < 0) { // letterSpacing < 0, like -20% -100%
            if (row.width < 0) {
                rowWidth = -row.width + style.fontSize + __letterSpacing
                rowX -= rowWidth
                rowWidth += style.fontSize
            } else {
                rowWidth -= __letterSpacing
            }
        }

        if (rowX < bounds.x) bounds.x = rowX
        if (rowWidth > bounds.width) bounds.width = rowWidth

        // clip nowrap
        if (__clipText && width && width < rowWidth) {
            row.isOverflow = true
            if (!drawData.overflow) drawData.overflow = rows.length
        }
    }

    bounds.y = y
    bounds.height = realHeight

}