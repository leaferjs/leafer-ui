import { MathHelper, Platform } from '@leafer/core'

import { ITextData, ITextDrawData } from '@leafer-ui/interface'

import { createRows } from './TextRows'
import { layoutChar } from './CharLayout'
import { layoutText } from './TextLayout'
import { clipText } from './TextClip'
import { decorationText } from './TextDecoration'


export const TextConvert = {

    getDrawData(content: string, style: ITextData): ITextDrawData {

        if (typeof content !== 'string') content = String(content)

        let x = 0, y = 0
        let { width, height, padding } = style
        const { textDecoration, textOverflow, __font } = style
        if (!width) width = 0

        if (padding) {
            const [top, right, bottom, left] = MathHelper.fourNumber(padding)
            if (width) {
                x = left
                width -= (right + left)
            }
            if (height) {
                y = top
                height -= (top + bottom)
            }
        }

        const drawData: ITextDrawData = {
            bounds: { x, y, width, height },
            rows: [],
            paraNumber: 0,
            font: Platform.canvas.font = __font
        }

        createRows(drawData, content, style) // set rows, paraNumber

        layoutText(drawData, style) // set bounds

        layoutChar(drawData, style, width, height) // set char.x

        if (drawData.overflow) clipText(drawData, textOverflow)

        if (textDecoration !== 'none') decorationText(drawData, style)

        return drawData

    }

}