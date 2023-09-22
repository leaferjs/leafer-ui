import { ILeaferCanvas, IPathDrawer, IPathCommandData, __Boolean, __Number, __String } from '@leafer/interface'
import { BoundsHelper, boundsType, dataProcessor, registerUI, affectStrokeBoundsType } from '@leafer/core'

import { IText, IFontWeight, ITextCase, ITextDecoration, ITextData, ITextInputData, ITextAlign, IVerticalAlign, ITextDrawData, IOverflow, IUnitData, IStrokeAlign } from '@leafer-ui/interface'
import { TextData, UnitConvert } from '@leafer-ui/data'

import { TextConvert } from '@leafer-ui/external'

import { UI } from './UI'


const { copyAndSpread, includes, spread } = BoundsHelper

@registerUI()
export class Text extends UI implements IText {

    public get __tag() { return 'Text' }

    @dataProcessor(TextData)
    declare public __: ITextData

    // size
    @boundsType(0)
    declare public width: __Number

    @boundsType(0)
    declare public height: __Number

    @boundsType(0)
    public padding: number | number[]

    @affectStrokeBoundsType('outside')
    declare public strokeAlign: IStrokeAlign

    @boundsType('')
    public text: __String

    @boundsType('L')
    public fontFamily: __String

    @boundsType(12)
    public fontSize: __Number

    @boundsType('normal')
    public fontWeight: IFontWeight

    @boundsType(false)
    public italic: __Boolean

    @boundsType('none')
    public textCase: ITextCase

    @boundsType('none')
    public textDecoration: ITextDecoration

    @boundsType(0)
    public letterSpacing: __Number | IUnitData

    @boundsType({ type: 'percent', value: 150 } as IUnitData)
    public lineHeight: __Number | IUnitData

    @boundsType(0)
    public paraIndent: __Number

    @boundsType(0)
    public paraSpacing: __Number

    @boundsType('left')
    public textAlign: ITextAlign

    @boundsType('top')
    public verticalAlign: IVerticalAlign

    @boundsType('show')
    public textOverflow: IOverflow | string

    public get textDrawData(): ITextDrawData {
        this.__layout.checkUpdate()
        return this.__.__textDrawData
    }

    constructor(data?: ITextInputData) {
        super(data)
    }

    public __drawHitPath(canvas: ILeaferCanvas): void {
        const { __lineHeight, __baseLine, __textDrawData: data } = this.__

        canvas.beginPath()

        if (this.__.__letterSpacing < 0) {
            this.__drawPathByData(canvas)
        } else {
            data.rows.forEach(row => canvas.rect(row.x, row.y - __baseLine, row.width, __lineHeight))
        }
    }

    public __drawPathByData(drawer: IPathDrawer, _data?: IPathCommandData): void {
        const { x, y, width, height } = this.__layout.boxBounds
        drawer.rect(x, y, width, height)
    }

    public __drawRenderPath(canvas: ILeaferCanvas): void {
        canvas.font = this.__.__font
    }

    public __updateTextDrawData(): void {
        const data = this.__
        data.__textDrawData = TextConvert.getDrawData(data.text, this.__)

    }

    public __updateBoxBounds(): void {

        const data = this.__
        const layout = this.__layout
        const { lineHeight, letterSpacing, fontFamily, fontSize, fontWeight, italic, textCase } = data

        // compute

        data.__lineHeight = UnitConvert.number(lineHeight, fontSize)
        data.__letterSpacing = UnitConvert.number(letterSpacing, fontSize)
        data.__baseLine = data.__lineHeight - (data.__lineHeight - fontSize * 0.7) / 2
        data.__font = `${italic ? 'italic ' : ''}${textCase === 'small-caps' ? 'small-caps ' : ''}${fontWeight !== 'normal' ? fontWeight + ' ' : ''}${fontSize}px ${fontFamily}`

        this.__updateTextDrawData()

        const { bounds } = data.__textDrawData
        const b = layout.boxBounds

        if (data.__lineHeight < fontSize) spread(bounds, fontSize / 2)

        const width = data.__getInput('width')
        const height = data.__getInput('height')

        if (width && height) {
            super.__updateBoxBounds()
        } else {
            b.x = width ? 0 : bounds.x
            b.y = height ? 0 : bounds.y
            b.width = width ? width : bounds.width
            b.height = height ? height : bounds.height
            this.__updateNaturalSize()
        }

        const contentBounds = includes(b, bounds) ? b : bounds
        if (contentBounds !== layout.contentBounds) {
            layout.contentBounds = contentBounds
            layout.renderChanged = true
        }

    }

    public __updateRenderSpread(): number {
        let width = super.__updateRenderSpread()
        if (!width) width = this.__layout.boxBounds === this.__layout.contentBounds ? 0 : 1
        return width
    }

    public __updateRenderBounds(): void {
        copyAndSpread(this.__layout.renderBounds, this.__layout.contentBounds, this.__layout.renderSpread)
    }

}