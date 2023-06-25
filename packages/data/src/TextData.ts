import { IFontWeight, ITextData } from '@leafer-ui/interface'

import { UIData } from "./UIData"


const fontWeightMap = {
    'thin': 100,
    'extra-light': 200,
    'light': 300,
    'normal': 400,
    'medium': 500,
    'semi-bold': 600,
    'bold': 700,
    'extra-bold': 800,
    'black': 900
}

export class TextData extends UIData implements ITextData {

    protected _fontWeight?: number

    setFontWeight(value: IFontWeight): void {
        if (typeof value === 'string') {
            this.__setInput('fontWeight', value)
            this._fontWeight = fontWeightMap[value] || 400
        } else {
            if (this.__input) this.__removeInput('fontWeight')
            this._fontWeight = value
        }
    }

}