import { ITextData, ITextDrawData } from '@leafer-ui/interface'


export function decorationText(drawData: ITextDrawData, style: ITextData): void {
    const { fontSize } = style
    drawData.decorationHeight = fontSize / 11
    switch (style.textDecoration) {
        case 'under':
            drawData.decorationY = fontSize * 0.15
            break
        case 'delete':
            drawData.decorationY = -fontSize * 0.35
    }
}