import { ITextData, ITextDrawData, ITextRowData } from '@leafer-ui/interface'


export function layoutText(drawData: ITextDrawData, style: ITextData): void {

    const { rows, bounds } = drawData
    const { __lineHeight, __baseLine, textAlign, verticalAlign, paraSpacing, textOverflow } = style

    let { x, y, width, height } = bounds, realHeight = __lineHeight * rows.length + (paraSpacing ? paraSpacing * (drawData.paraNumber - 1) : 0)
    let starY: number = __baseLine

    // verticalAlign

    if (height) {
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
    }

    // textAlign

    let row: ITextRowData

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

        if (row.width > bounds.width) bounds.width = row.width
    }

    bounds.y = y
    bounds.height = realHeight

}