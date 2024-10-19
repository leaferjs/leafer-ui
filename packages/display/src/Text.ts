import { ILeaferCanvas, IPathDrawer, IPathCommandData, IBoolean, INumber, IString, IBoundsData, IUnitData } from '@leafer/interface'
import { BoundsHelper, boundsType, surfaceType, dataProcessor, registerUI, affectStrokeBoundsType, dataType, hitType, MathHelper } from '@leafer/core'

import { IFill, IText, IFontWeight, ITextCase, ITextDecoration, ITextData, ITextInputData, ITextAlign, IVerticalAlign, ITextDrawData, IOverflow, IStrokeAlign, IHitType, ITextWrap } from '@leafer-ui/interface'
import { TextData } from '@leafer-ui/data'

import { TextConvert, UnitConvert } from '@leafer-ui/external'

import { UI } from './UI'


const { copyAndSpread, includes, isSame, spread, setList } = BoundsHelper

@registerUI()
export class Text extends UI implements IText {

    public get __tag() { return 'Text' }

    @dataProcessor(TextData)
    declare public __: ITextData

    // size
    @boundsType(0)
    declare public width?: INumber

    @boundsType(0)
    declare public height?: INumber

    @dataType(false)
    public resizeFontSize?: IBoolean

    @surfaceType('#000000')
    declare public fill?: IFill

    @affectStrokeBoundsType('outside')
    declare public strokeAlign?: IStrokeAlign

    @hitType('all')
    declare public hitFill?: IHitType

    @boundsType('')
    public text?: IString

    @boundsType('L')
    public fontFamily?: IString

    @boundsType(12)
    public fontSize?: INumber

    @boundsType('normal')
    public fontWeight?: IFontWeight

    @boundsType(false)
    public italic?: IBoolean

    @boundsType('none')
    public textCase?: ITextCase

    @boundsType('none')
    public textDecoration?: ITextDecoration

    @boundsType(0)
    public letterSpacing?: INumber | IUnitData

    @boundsType({ type: 'percent', value: 1.5 } as IUnitData)
    public lineHeight?: INumber | IUnitData

    @boundsType(0)
    public paraIndent?: INumber

    @boundsType(0)
    public paraSpacing?: INumber

    @boundsType('left')
    public textAlign?: ITextAlign

    @boundsType('top')
    public verticalAlign?: IVerticalAlign

    @boundsType(true)
    public autoSizeAlign?: IBoolean

    @boundsType('normal')
    public textWrap?: ITextWrap

    @boundsType('show')
    public textOverflow?: IOverflow | string

    public get textDrawData(): ITextDrawData {
        this.__layout.update()
        return this.__.__textDrawData
    }


    constructor(data?: ITextInputData) {
        super(data)
    }

    public __drawHitPath(canvas: ILeaferCanvas): void {
        const { __lineHeight, fontSize, __baseLine, __textDrawData: data } = this.__

        canvas.beginPath()

        if (this.__.__letterSpacing < 0) {
            this.__drawPathByData(canvas)
        } else {
            data.rows.forEach(row => canvas.rect(row.x, row.y - __baseLine, row.width, __lineHeight < fontSize ? fontSize : __lineHeight))
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
        const { lineHeight, letterSpacing, fontFamily, fontSize, fontWeight, italic, textCase, textOverflow, padding } = data

        const autoWidth = data.__autoWidth
        const autoHeight = data.__autoHeight

        // compute

        data.__lineHeight = UnitConvert.number(lineHeight, fontSize)
        data.__letterSpacing = UnitConvert.number(letterSpacing, fontSize)
        data.__padding = padding ? MathHelper.fourNumber(padding) : undefined
        data.__baseLine = data.__lineHeight - (data.__lineHeight - fontSize * 0.7) / 2
        data.__font = `${italic ? 'italic ' : ''}${textCase === 'small-caps' ? 'small-caps ' : ''}${fontWeight !== 'normal' ? fontWeight + ' ' : ''}${fontSize}px ${fontFamily}`
        data.__clipText = textOverflow !== 'show' && !data.__autoSize

        this.__updateTextDrawData()

        const { bounds } = data.__textDrawData
        const b = layout.boxBounds

        if (data.__lineHeight < fontSize) spread(bounds, fontSize / 2)

        if (autoWidth || autoHeight) {
            b.x = autoWidth ? bounds.x : 0
            b.y = autoHeight ? bounds.y : 0
            b.width = autoWidth ? bounds.width : data.width
            b.height = autoHeight ? bounds.height : data.height

            if (padding) {
                const [top, right, bottom, left] = data.__padding
                if (autoWidth) {
                    b.x -= left
                    b.width += (right + left)
                }
                if (autoHeight) {
                    b.y -= top
                    b.height += (bottom + top)
                }
            }
            this.__updateNaturalSize()
        } else {
            super.__updateBoxBounds()
        }

        if (italic) b.width += fontSize * 0.16

        const contentBounds = includes(b, bounds) ? b : bounds
        if (!isSame(contentBounds, layout.contentBounds)) {
            layout.contentBounds = contentBounds
            layout.renderChanged = true
            setList(data.__textBoxBounds = {} as IBoundsData, [b, bounds])
        } else {
            data.__textBoxBounds = contentBounds
        }

    }

    public __updateRenderSpread(): number {
        let width = super.__updateRenderSpread()
        if (!width) width = this.__layout.boxBounds === this.__layout.contentBounds ? 0 : 1
        return width
    }

    public __updateRenderBounds(): void {
        copyAndSpread(this.__layout.renderBounds, this.__.__textBoxBounds, this.__layout.renderSpread)
    }

}