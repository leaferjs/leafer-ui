import { IBooleanMap } from '@leafer-ui/interface'

const money = '¥￥＄€£￡¢￠'
const letter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz'

const langBefore = '《（「〈『〖【〔｛┌＜’“＝' + money
const langAfter = '》）」〉』〗】〕｝┐＞’“！？，、。：；‰'
const langSymbol = '≮≯≈≠＝…'
const langBreak = '—／～｜┆·'

const beforeChar = '{[(<\'"' + langBefore
const afterChar = '>)]}%!?,.:;\'"' + langAfter
const symbolChar = afterChar + '_#~&*+\\=|' + langSymbol
const breakChar = '- ' + langBreak

function mapChar(str: string): IBooleanMap {
    const map: IBooleanMap = {}
    str.split('').forEach(char => map[char] = true)
    return map
}

const letterMap = mapChar(letter)
const beforeMap = mapChar(beforeChar)
const afterMap = mapChar(afterChar)
const symbolMap = mapChar(symbolChar)
const breakMap = mapChar(breakChar)

export enum CharType {
    Letter, // en... number
    Single, // cjk
    Before, // (
    After, // )
    Symbol, // *
    Break, // space
}

const { Letter, Single, Before, After, Symbol, Break } = CharType

export function getCharType(char: string): CharType {

    if (letterMap[char]) {
        return Letter
    } else if (breakMap[char]) {
        return Break
    } else if (/[\u3400-\u9FBF]/.test(char)) { // 4e00-\u9FBF cjk
        return Single
    } else if (beforeMap[char]) {
        return Before
    } else if (afterMap[char]) {
        return After
    } else if (symbolMap[char]) {
        return Symbol
    } else {
        return Letter
    }

}
