import { ITextCharData, ITextData, ITextDrawData } from '@leafer-ui/interface'


const CharMode = 0 // data: [{char:'a', x: 0}, {char:'b', x: 5}, {char:'d', x:20}]
const WordMode = 1 // data: [{ char:'ab', x: 0}, { char:'d', x:20}]
const RowMode = 2 // text: 'ab  c'

export function layoutChar(drawData: ITextDrawData, style: ITextData, width: number, _height: number): void {

    const { rows } = drawData
    const { textAlign, paraIndent, letterSpacing } = style
    let charX: number, addWordWidth: number, indentWidth: number, mode: number, wordChar: ITextCharData

    rows.forEach(row => {
        if (row.words) {

            indentWidth = paraIndent && row.paraStart ? paraIndent : 0
            addWordWidth = (width && textAlign === 'justify' && row.words.length > 1) ? (width - row.width - indentWidth) / (row.words.length - 1) : 0
            mode = (letterSpacing || row.isOverflow) ? CharMode : (addWordWidth > 0.01 ? WordMode : RowMode)

            if (mode === RowMode) {

                row.text = ''
                row.x += indentWidth

                row.words.forEach(word => {
                    word.data.forEach(char => {
                        row.text += char.char
                    })
                })

            } else {

                row.x += indentWidth
                charX = row.x
                row.data = []

                row.words.forEach(word => {

                    if (mode === WordMode) {

                        wordChar = { char: '', x: charX }
                        charX = toWordChar(word.data, charX, wordChar)
                        if (wordChar.char !== ' ') row.data.push(wordChar)

                    } else {

                        charX = toChar(word.data, charX, row.data)

                    }

                    if (!row.paraEnd && addWordWidth) {
                        charX += addWordWidth
                        row.width += addWordWidth
                    }

                })
            }

            row.words = null
        }
    })

}

function toWordChar(data: ITextCharData[], charX: number, wordChar: ITextCharData): number {
    data.forEach(char => {
        wordChar.char += char.char
        charX += char.width
    })
    return charX
}

function toChar(data: ITextCharData[], charX: number, rowData: ITextCharData[]): number {
    data.forEach(char => {
        if (char.char !== ' ') {
            char.x = charX
            rowData.push(char)
        }
        charX += char.width
    })
    return charX
}