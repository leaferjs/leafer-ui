import { ILeaferCanvas, IBoolean, INumber, IString, IBoundsData, IUnitData, IRenderOptions, IFourNumber } from '@leafer/interface'
import { BoundsHelper, boundsType, surfaceType, dataProcessor, registerUI, affectStrokeBoundsType, dataType, hitType, MathHelper, DataHelper } from '@leafer/core'

import { IFill, IText, IFontWeight, ITextCase, ITextDecoration, ITextData, ITextInputData, ITextAlign, IVerticalAlign, ITextDrawData, ITextOverflow, IStrokeAlign, IHitType, ITextWrap, IWritingMode, IBackgroundBoxStyle } from '@leafer-ui/interface'
import { TextData } from '@leafer-ui/data'

import { TextConvert, UnitConvert } from '@leafer-ui/external'

import { UI } from './UI'


const { copyAndSpread, includes, spread, setList } = BoundsHelper, { stintSet } = DataHelper

@registerUI()
export class Text<TConstructorData = ITextInputData> extends UI<TConstructorData> implements IText {

    public get __tag() { return 'Text' }

    @dataProcessor(TextData)
    declare public __: ITextData

    // size
    @boundsType(0)
    declare public width?: INumber

    @boundsType(0)
    declare public height?: INumber

    @surfaceType()
    public boxStyle: IBackgroundBoxStyle

    @dataType(false)
    public resizeFontSize?: IBoolean

    @surfaceType('#000000')
    declare public fill?: IFill

    @affectStrokeBoundsType('outside')
    declare public strokeAlign?: IStrokeAlign

    @hitType('all')
    declare public hitFill?: IHitType

    @boundsType('')
    public text?: IString | INumber

    @boundsType('')
    public placeholder?: IString

    @boundsType('caption')
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

    @boundsType('x')
    public writingMode?: IWritingMode

    @boundsType('left')
    public textAlign?: ITextAlign

    @boundsType('top')
    public verticalAlign?: IVerticalAlign

    @boundsType(true)
    public autoSizeAlign?: IBoolean

    @boundsType('normal')
    public textWrap?: ITextWrap

    @boundsType('show')
    public textOverflow?: ITextOverflow

    @surfaceType(false)
    public textEditing: boolean

    public isOverflow: boolean

    public get textDrawData(): ITextDrawData { this.updateLayout(); return this.__.__textDrawData }


    public __updateTextDrawData(): void {
        const data = this.__
        const { lineHeight, letterSpacing, fontFamily, fontSize, fontWeight, italic, textCase, textOverflow, padding, width, height } = data

        data.__lineHeight = UnitConvert.number(lineHeight, fontSize)
        data.__letterSpacing = UnitConvert.number(letterSpacing, fontSize)
        data.__baseLine = data.__lineHeight - (data.__lineHeight - fontSize * 0.7) / 2 // 基线位置
        data.__font = `${italic ? 'italic ' : ''}${textCase === 'small-caps' ? 'small-caps ' : ''}${fontWeight !== 'normal' ? fontWeight + ' ' : ''}${fontSize || 12}px ${fontFamily || 'caption'}`

        stintSet(data, '__padding', padding && MathHelper.fourNumber(padding))
        stintSet(data, '__clipText', textOverflow !== 'show' && !data.__autoSize)
        stintSet(data, '__isCharMode', (width || height || data.__letterSpacing || (textCase !== 'none')) as boolean)

        data.__textDrawData = TextConvert.getDrawData((data.__isPlacehold = data.placeholder && data.text === '') ? data.placeholder : data.text, this.__)
    }

    override __updateBoxBounds(): void {

        const data = this.__
        const layout = this.__layout
        const { fontSize, italic, padding, __autoWidth: autoWidth, __autoHeight: autoHeight } = data

        this.__updateTextDrawData() // layout text

        const { bounds: contentBounds } = data.__textDrawData
        const b = layout.boxBounds

        layout.contentBounds = contentBounds

        if (data.__lineHeight < fontSize) spread(contentBounds, fontSize / 2)

        if (autoWidth || autoHeight) {
            b.x = autoWidth ? contentBounds.x : 0
            b.y = autoHeight ? contentBounds.y : 0
            b.width = autoWidth ? contentBounds.width : data.width
            b.height = autoHeight ? contentBounds.height : data.height

            if (padding) {
                const [top, right, bottom, left] = data.__padding
                if (autoWidth) b.x -= left, b.width += (right + left)
                if (autoHeight) b.y -= top, b.height += (bottom + top)
            }
            this.__updateNaturalSize()
        } else super.__updateBoxBounds()

        if (italic) b.width += fontSize * 0.16 // 倾斜会导致文本的bounds增大

        DataHelper.stintSet(this, 'isOverflow', !includes(b, contentBounds))

        if (this.isOverflow) setList(data.__textBoxBounds = {} as IBoundsData, [b, contentBounds]), layout.renderChanged = true
        else data.__textBoxBounds = b
    }

    override __updateRenderSpread(): IFourNumber {
        let spread = super.__updateRenderSpread()
        if (!spread) spread = this.isOverflow ? 1 : 0
        return spread
    }

    override __updateRenderBounds(): void {
        const { renderBounds, renderSpread } = this.__layout
        copyAndSpread(renderBounds, this.__.__textBoxBounds, renderSpread)
        if (this.__box) this.__box.__layout.renderBounds = renderBounds
    }

    override __updateChange(): void {
        super.__updateChange()
        const box = this.__box
        if (box) box.__onUpdateSize(), box.__updateChange()
    }

    override __drawRenderPath(canvas: ILeaferCanvas): void {
        canvas.font = this.__.__font
    }

    override __draw(canvas: ILeaferCanvas, options: IRenderOptions, originCanvas?: ILeaferCanvas): void {
        const box = this.__box
        if (box) box.__nowWorld = this.__nowWorld, box.__draw(canvas, options, originCanvas)
        if (this.textEditing && !options.exporting) return
        super.__draw(canvas, options, originCanvas)
    }

    override  __drawShape(canvas: ILeaferCanvas, options: IRenderOptions): void {
        if (options.shape) this.__box && this.__box.__drawShape(canvas, options)
        super.__drawShape(canvas, options)
    }

    override destroy(): void {
        if (this.boxStyle) this.boxStyle = null
        super.destroy()
    }

}