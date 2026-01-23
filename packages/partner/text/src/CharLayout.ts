import { ITextCharData, ITextData, ITextDrawData, ITextRowData } from '@leafer-ui/interface'


const CharMode = 0 // data: [{char:'a', x: 0}, {char:'b', x: 5}, {char:'d', x:20}]
const WordMode = 1 // data: [{ char:'ab', x: 0}, { char:'d', x:20}]
const TextMode = 2 // text: 'ab  c'

export function layoutChar(drawData: ITextDrawData, style: ITextData, width: number, _height: number): void {

    const { rows } = drawData
    const { textAlign, paraIndent, __letterSpacing } = style

    const justifyLast = width && textAlign.includes('both')  // 最后一行是否两端对齐
    const justify = justifyLast || (width && textAlign.includes('justify')) // 是否两端对齐文本
    const justifyLetter = justify && textAlign.includes('letter') // 英文是否通过加大字符间距两端对齐

    let charX: number, remainingWidth: number, addWordWidth: number, addLetterWidth: number, indentWidth: number, mode: number, wordChar: ITextCharData, wordsLength: number, isLastWord: boolean, canJustify: boolean

    rows.forEach(row => {
        if (row.words) {

            indentWidth = paraIndent && row.paraStart ? paraIndent : 0, wordsLength = row.words.length
            if (justify) {
                canJustify = !row.paraEnd || justifyLast
                remainingWidth = width - row.width - indentWidth
                if (justifyLetter) addLetterWidth = remainingWidth / (row.words.reduce((total, item) => total + item.data.length, 0) - 1) //  remainingWidth / （lettersLength - 1）
                else addWordWidth = wordsLength > 1 ? remainingWidth / (wordsLength - 1) : 0
            }
            mode = (__letterSpacing || row.isOverflow || justifyLetter) ? CharMode : (addWordWidth ? WordMode : TextMode)
            if (row.isOverflow && !__letterSpacing) row.textMode = true

            if (mode === TextMode) {

                row.x += indentWidth
                toTextChar(row)

            } else {

                row.x += indentWidth
                charX = row.x
                row.data = []

                row.words.forEach((word, index) => {

                    if (mode === WordMode) {

                        wordChar = { char: '', x: charX }
                        charX = toWordChar(word.data, charX, wordChar)
                        if (row.isOverflow || wordChar.char !== ' ') row.data.push(wordChar)

                    } else {

                        charX = toChar(word.data, charX, row.data, row.isOverflow, canJustify && addLetterWidth)

                    }

                    if (canJustify) {
                        isLastWord = index === wordsLength - 1

                        if (addWordWidth) {
                            if (!isLastWord) charX += addWordWidth, row.width += addWordWidth
                        } else if (addLetterWidth) {
                            row.width += addLetterWidth * (word.data.length - (isLastWord ? 1 : 0))
                        }
                    }

                })
            }

            row.words = null
        }
    })

}

function toTextChar(row: ITextRowData): void {
    row.text = ''
    row.words.forEach(word => {
        word.data.forEach(char => {
            row.text += char.char
        })
    })
}

function toWordChar(data: ITextCharData[], charX: number, wordChar: ITextCharData): number {
    data.forEach(char => {
        wordChar.char += char.char
        charX += char.width
    })
    return charX
}

function toChar(data: ITextCharData[], charX: number, rowData: ITextCharData[], isOverflow?: boolean, addLetterWidth?: number): number {
    data.forEach(char => {
        if (isOverflow || char.char !== ' ') {
            char.x = charX
            rowData.push(char)
        }
        charX += char.width
        addLetterWidth && (charX += addLetterWidth)
    })
    return charX
}