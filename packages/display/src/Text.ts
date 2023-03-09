import { IPathDrawer, IPathCommandData, __Boolean, __Number, __String } from '@leafer/interface'
import { Platform, boundsType, dataProcessor, registerUI, useModule } from '@leafer/core'

import { IText, IFontWeight, ITextCase, ITextDecoration, IPercent, ITextData, ITextInputData } from '@leafer-ui/interface'
import { TextData } from '@leafer-ui/data'
import { TextRender } from '@leafer-ui/display-module'

import { UI } from './UI'


@useModule(TextRender)
@registerUI()
export class Text extends UI implements IText {

    @dataProcessor(TextData)
    public __: ITextData

    @boundsType('')
    public content: __String

    @boundsType('arial')
    public fontFamily: __String

    @boundsType(12)
    public fontSize: __Number

    @boundsType('normal')
    public fontWeight: IFontWeight

    @boundsType(false)
    public italic: __Boolean

    @boundsType('normal')
    public textCase: ITextCase

    @boundsType('normal')
    public textDecoration: ITextDecoration

    @boundsType()
    public letterSpacing: __Number | IPercent

    @boundsType()
    public lineHeight: __Number | IPercent

    @boundsType()
    public paragraphIndent: __Number

    @boundsType()
    public paragraphSpacing: __Number

    constructor(data?: ITextInputData) {
        super(data)
    }

    public __drawPathByData(drawer: IPathDrawer, _data: IPathCommandData): void {
        const { width, height } = this.__
        drawer.rect(0, 0, width, height)
    }

    public __updateBoxBounds(): void {
        const { fontFamily, fontSize, fontWeight, italic, textCase, lineHeight } = this.__
        const b = this.__layout.boxBounds

        this.__.__font = Platform.canvas.font = `${italic ? 'italic' : ''} ${textCase === 'small-caps' ? 'small-caps' : 'normal'} ${fontWeight ? fontWeight : 'normal'} ${fontSize}px/${lineHeight ? lineHeight : fontSize}px ${fontFamily}`
        const width = Platform.canvas.measureText(this.content).width
        const height = fontSize

        b.x = 0
        b.y = -fontSize * 0.75
        b.width = width
        b.height = height
    }

}