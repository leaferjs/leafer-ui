import { UICreator } from '@leafer/core'

import { IFontWeight, ITextData, IUI, IText, IObject } from '@leafer-ui/interface'

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

    public get __useNaturalRatio() { return false }

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

    setBoxStyle(value: IUI) {
        const t = this.__leaf as IText, { boxStyle } = this as ITextData
        let bgBox = t.__bgBox

        if (value) {

            if (boxStyle) {
                for (let key in boxStyle) (bgBox as IObject)[key] = undefined
            } else {
                bgBox = t.__bgBox = UICreator.get('Rect', 0 as any) as IUI // 传递 0 可以优化内存占用
                bgBox.__layout.boxBounds = t.__layout.boxBounds
            }

            bgBox.set(value)

        } else {

            if (bgBox) {
                t.__bgBox = bgBox.__layout.boxBounds = undefined
                bgBox.destroy()
            }

        }

    }

}