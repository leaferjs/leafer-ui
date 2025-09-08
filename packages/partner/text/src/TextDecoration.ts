import { isObject } from '@leafer/core'

import { ITextData, ITextDecorationType, ITextDrawData } from '@leafer-ui/interface'
import { ColorConvert } from '@leafer-ui/draw'


export function decorationText(drawData: ITextDrawData, style: ITextData): void {
    let type: ITextDecorationType, offset = 0
    const { fontSize, textDecoration } = style
    drawData.decorationHeight = fontSize / 11
    if (isObject(textDecoration)) {
        type = textDecoration.type
        if (textDecoration.color) drawData.decorationColor = ColorConvert.string(textDecoration.color)
        if (textDecoration.offset) offset = Math.min(fontSize * 0.3, Math.max(textDecoration.offset, -fontSize * 0.15))
    } else type = textDecoration
    switch (type) {
        case 'under':
            drawData.decorationY = [fontSize * 0.15 + offset]
            break
        case 'delete':
            drawData.decorationY = [-fontSize * 0.35]
            break
        case 'under-delete':
            drawData.decorationY = [fontSize * 0.15 + offset, -fontSize * 0.35]
    }
}