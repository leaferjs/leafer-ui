import { INumber, IBoolean, IString, IFourNumber, IUnitData, IScaleFixed } from '@leafer/interface'
import { IStrokeAlign, IStrokeCap, IStrokeJoin, IBlurEffect, IFontWeight, ITextCase, ITextDecoration, IShadowEffect, IGrayscaleEffect, ITextAlign, IVerticalAlign, ITextWrap, IStroke, IFill, IArrowStyle, IWritingMode, ITextOverflow } from './type/IType'
import { ILeafStrokePaint, ILeafShadowEffect, ILeafPaint } from './type/IComputedType'
import { IDashPatternString, IShadowString, IColorString, IStrokeWidthString, ICornerRadiusString } from './type/IStringType'


// corner---
export interface ICornerRadiusAttrData {
    cornerRadius?: IFourNumber | ICornerRadiusString
    cornerSmoothing?: INumber
}
export interface ICornerRadiusInputData {
    cornerRadius?: IFourNumber | ICornerRadiusString
    cornerSmoothing?: INumber
}
export interface ICornerRadiusComputedData {
    cornerRadius?: number
    cornerSmoothing?: number
}

// fill---
export interface IFillAttrData {
    fill?: IFill
}
export interface IFillInputData {
    fill?: IFill
}
export interface IFillComputedData {
    fill?: IColorString | ILeafPaint[]
}

// border 
export interface IBorderComputedData {
    borderWidth?: number | number[]
    borderRadius?: number | number[]
}

// stroke---
export interface IStrokeAttrData extends IStrokeStyle {
    stroke?: IStroke

    startArrow?: IArrowStyle
    endArrow?: IArrowStyle
}

export interface IStrokeInputData extends IStrokeStyle {
    stroke?: IStroke

    startArrow?: IArrowStyle
    endArrow?: IArrowStyle
}

export interface IStrokeStyle {
    strokeAlign?: IStrokeAlign
    strokeWidth?: IFourNumber | IStrokeWidthString
    strokeWidthFixed?: IScaleFixed
    strokeCap?: IStrokeCap
    strokeJoin?: IStrokeJoin
    dashPattern?: INumber[] | IDashPatternString
    dashOffset?: INumber
    miterLimit?: INumber
}

export interface IStrokeComputedData extends IStrokeComputedStyle {
    stroke?: IColorString | ILeafStrokePaint[]

    startArrow?: IArrowStyle
    endArrow?: IArrowStyle
}

export interface IStrokeComputedStyle {
    strokeAlign?: IStrokeAlign
    strokeWidth?: number
    strokeWidths?: number[]
    strokeWidthFixed?: IScaleFixed
    strokeCap?: IStrokeCap
    strokeJoin?: IStrokeJoin
    dashPattern?: number[]
    dashOffset?: number
    miterLimit?: number
}

// text---
export interface ITextStyleAttrData {
    fontFamily?: IString
    fontSize?: INumber
    fontWeight?: IFontWeight
    italic?: IBoolean
    textCase?: ITextCase
    textDecoration?: ITextDecoration
    letterSpacing?: INumber | IUnitData
    lineHeight?: INumber | IUnitData

    paraIndent?: INumber
    paraSpacing?: INumber

    writingMode?: IWritingMode
    textAlign?: ITextAlign
    verticalAlign?: IVerticalAlign
    autoSizeAlign?: IBoolean

    textWrap?: ITextWrap
    textOverflow?: ITextOverflow
}
export interface ITextStyleInputData {
    fontFamily?: IString
    fontSize?: INumber
    fontWeight?: IFontWeight
    italic?: IBoolean
    textCase?: ITextCase
    textDecoration?: ITextDecoration
    letterSpacing?: INumber | IUnitData
    lineHeight?: INumber | IUnitData

    paraIndent?: INumber
    paraSpacing?: INumber

    writingMode?: IWritingMode
    textAlign?: ITextAlign
    verticalAlign?: IVerticalAlign
    autoSizeAlign?: IBoolean

    textWrap?: ITextWrap
    textOverflow?: ITextOverflow
}
export interface ITextStyleComputedData {
    fontFamily?: string
    fontSize?: number
    fontWeight?: IFontWeight
    italic?: boolean
    textCase?: ITextCase
    textDecoration?: ITextDecoration
    letterSpacing?: number
    lineHeight?: number

    paraIndent?: number
    paraSpacing?: number

    writingMode?: IWritingMode
    textAlign?: ITextAlign
    verticalAlign?: IVerticalAlign
    autoSizeAlign?: boolean // 自动宽高的文本，是否仍进行整体对齐操作

    textWrap?: ITextWrap
    textOverflow?: ITextOverflow
}

// effect---
export interface IEffectAttrData {
    shadow?: IShadowEffect | IShadowEffect[] | IShadowString
    innerShadow?: IShadowEffect | IShadowEffect[] | IShadowString
    blur?: INumber | IBlurEffect
    backgroundBlur?: INumber | IBlurEffect
    grayscale?: INumber | IGrayscaleEffect
}
export interface IEffectInputData {
    shadow?: IShadowEffect | IShadowEffect[] | IShadowString
    innerShadow?: IShadowEffect | IShadowEffect[] | IShadowString
    blur?: INumber | IBlurEffect
    backgroundBlur?: INumber | IBlurEffect
    grayscale?: INumber | IGrayscaleEffect
}
export interface IEffectComputedData {
    shadow?: ILeafShadowEffect[]
    innerShadow?: ILeafShadowEffect[]
    blur?: number
    backgroundBlur?: number
    grayscale?: number
}
