import { IJSONOptions } from '@leafer/interface'
import { UICreator, isString } from '@leafer/core'

import { IFontWeight, ITextData, IUI, IText, IObject, IBackgroundBoxStyle, IFontWeightNumer, ITextInputData } from '@leafer-ui/interface'

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
    protected _boxStyle?: IBackgroundBoxStyle

    setFontWeight(value: IFontWeight): void {
        if (isString(value)) {
            this.__setInput('fontWeight', value)
            value = fontWeightMap[value] as IFontWeightNumer || 400
        } else if (this.__input) this.__removeInput('fontWeight')
        this._fontWeight = value
    }

    setBoxStyle(value: IUI) {
        let t = this.__leaf as IText, box = t.__box

        if (value) {

            const { boxStyle } = this as ITextData
            if (box) for (let key in boxStyle) (box as IObject)[key] = undefined
            else box = t.__box = UICreator.get('Rect', 0 as any) as IUI // 传递 0 可以优化内存占用

            const layout = t.__layout, boxLayout = box.__layout
            if (!boxStyle) box.parent = t as any, box.__world = t.__world, boxLayout.boxBounds = layout.boxBounds

            box.set(value)
            if (boxLayout.strokeChanged) layout.strokeChange()

        } else if (box) {
            t.__box = box.parent = null
            box.destroy()
        }

        this._boxStyle = value

    }

    public __getInputData(names?: string[] | IObject, options?: IJSONOptions): IObject {
        const data: ITextInputData = super.__getInputData(names, options)
        if (data.textEditing) delete data.textEditing
        return data
    }

}