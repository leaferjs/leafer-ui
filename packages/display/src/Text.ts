import { ICanvasDrawPath, IPathCommandData } from '@leafer/interface'
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
    public content: string

    @boundsType('arial')
    public fontFamily: string

    @boundsType(12)
    public fontSize: number

    @boundsType('normal')
    public fontWeight: IFontWeight

    @boundsType(false)
    public italic: boolean

    @boundsType('normal')
    public textCase: ITextCase

    @boundsType('normal')
    public textDecoration: ITextDecoration

    @boundsType()
    public letterSpacing: number | IPercent

    @boundsType()
    public lineHeight: number | IPercent

    @boundsType()
    public paragraphIndent: number

    @boundsType()
    public paragraphSpacing: number

    constructor(data?: ITextInputData) {
        super(data)
    }

    public __updatePath(): void {

    }

    public __drawPathByData(drawer: ICanvasDrawPath, _data: IPathCommandData): void {
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