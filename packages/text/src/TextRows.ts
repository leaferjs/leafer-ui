import { Platform } from '@leafer/core'

import { IBoundsData, ITextData, ITextDrawData, ITextRowData, ITextWordData } from '@leafer-ui/interface'

import { CharType, getCharType } from './CharType'
import { TextRowHelper } from './TextRowHelper'
import { getTextCase } from './TextCase'


const { trimRight } = TextRowHelper
const { Letter, Single, Before, After, Symbol, Break } = CharType

let word: ITextWordData, row: ITextRowData, wordWidth: number, rowWidth: number, realWidth: number
let char: string, charWidth: number, charType: CharType, lastCharType: CharType, langBreak: boolean, afterBreak: boolean, paraStart: boolean
let textDrawData: ITextDrawData, rows: ITextRowData[] = [], bounds: IBoundsData

export function createRows(drawData: ITextDrawData, content: string, style: ITextData): void {

    textDrawData = drawData
    rows = drawData.rows
    bounds = drawData.bounds

    const { __letterSpacing, paraIndent, textCase } = style
    const { canvas } = Platform
    const { width, height } = bounds
    const charMode = width || height || __letterSpacing || (textCase !== 'none')

    if (charMode) {

        paraStart = true
        lastCharType = null
        wordWidth = rowWidth = 0
        word = { data: [] }, row = { words: [] }

        for (let i = 0, len = content.length; i < len; i++) {

            char = content[i]

            if (char === '\n') {

                if (wordWidth) addWord()
                row.paraEnd = true
                addRow()

                paraStart = true

            } else {

                charType = getCharType(char)

                if (charType === Letter && textCase !== 'none') char = getTextCase(char, textCase, !wordWidth)

                charWidth = canvas.measureText(char).width
                if (__letterSpacing) charWidth += __letterSpacing

                langBreak = (charType === Single && (lastCharType === Single || lastCharType === Letter)) || (lastCharType === Single && charType !== After) // break  U字 文字 or 字U  字（  字*  exclude 字。
                afterBreak = ((charType === Before || charType === Single) && (lastCharType === Symbol || lastCharType === After)) // split >(  =文 。哈  ;文

                realWidth = paraStart && paraIndent ? width - paraIndent : width

                if (width && rowWidth + wordWidth + charWidth > realWidth) { // wrap

                    if (!afterBreak) afterBreak = charType === Letter && lastCharType == After // split ，S  

                    if (langBreak || afterBreak || charType === Break || charType === Before || charType === Single || (wordWidth + charWidth > realWidth)) {

                        if (wordWidth) addWord() // break
                        addRow()

                    } else {

                        addRow()
                    }

                }

                if (char === ' ' && paraStart !== true && (rowWidth + wordWidth) === 0) {

                    // trim space

                } else {

                    if (charType === Break) {

                        if (char === ' ' && wordWidth) addWord()
                        addChar(char, charWidth)
                        addWord()

                    } else if (langBreak || afterBreak) {

                        if (wordWidth) addWord()
                        addChar(char, charWidth)

                    } else {

                        addChar(char, charWidth)

                    }
                }

                lastCharType = charType

            }

        }

        if (wordWidth) addWord()
        if (rowWidth) addRow()

        rows.length > 0 && (rows[rows.length - 1].paraEnd = true)

    } else {

        content.split('\n').forEach(content => {
            textDrawData.paraNumber++
            rows.push({ x: paraIndent || 0, text: content, width: canvas.measureText(content).width, paraStart: true })
        })

    }
}


function addChar(char: string, width: number): void {
    word.data.push({ char, width })
    wordWidth += width
}

function addWord(): void {
    rowWidth += wordWidth
    word.width = wordWidth
    row.words.push(word)
    word = { data: [] }
    wordWidth = 0
}

function addRow(): void {
    if (paraStart) {
        textDrawData.paraNumber++
        row.paraStart = true
        paraStart = false
    }
    row.width = rowWidth
    if (bounds.width) trimRight(row)
    rows.push(row)
    row = { words: [] }
    rowWidth = 0
}
