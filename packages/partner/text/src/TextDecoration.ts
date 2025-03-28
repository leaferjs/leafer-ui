import { ITextData, ITextDecorationType, ITextDrawData } from '@leafer-ui/interface'

import { ColorConvert } from '@leafer-ui/draw'


export function decorationText(drawData: ITextDrawData, style: ITextData): void {
    let type: ITextDecorationType
    const { fontSize, textDecoration } = style
    drawData.decorationHeight = fontSize / 11
    if (typeof textDecoration === 'object') {
        type = textDecoration.type
        if (textDecoration.color) drawData.decorationColor = ColorConvert.string(textDecoration.color)
    } else type = textDecoration
    switch (type) {
        case 'under':
            drawData.decorationY = [fontSize * 0.15]
            break
        case 'delete':
            drawData.decorationY = [-fontSize * 0.35]
            break
        case 'under-delete':
            drawData.decorationY = [fontSize * 0.15, -fontSize * 0.35]
    }
}