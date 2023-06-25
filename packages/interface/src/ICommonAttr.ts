import { IPaint, IStrokeAlign, IStrokeCap, IStrokeJoin, IBlurEffect, IFontWeight, ITextCase, ITextDecoration, IShadowEffect, IGrayscaleEffect, ITextAlign, IVerticalAlign, IOverflow, IUnitData } from './type/IType'
import { ILeafStrokePaint, ILeafShadowEffect, ILeafPaint } from './type/IComputedType'
import { IPaintString, IDashPatternString, IShadowString, IColorString, IStrokeWidthString, ICornerRadiusString } from './type/IStringType'

// corner---
export interface ICornerRadiusAttrData {
    cornerRadius: number | number[] | ICornerRadiusString
    cornerSmoothing: number
}
export interface ICornerRadiusInputData {
    cornerRadius?: number | number[] | ICornerRadiusString
    cornerSmoothing?: number
}
export interface ICornerRadiusComputedData {
    cornerRadius?: number
    cornerSmoothing?: number
}

// fill---
export interface IFillAttrData {
    fill: IPaint | IPaint[] | IPaintString
}
export interface IFillInputData {
    fill?: IPaint | IPaint[] | IPaintString
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
export interface IStrokeAttrData {
    stroke: IPaint | IPaint[] | IPaintString

    strokeAlign: IStrokeAlign
    strokeWidth: number | number[] | IStrokeWidthString
    strokeCap: IStrokeCap
    strokeJoin: IStrokeJoin
    dashPattern: number[] | IDashPatternString
    dashOffset: number
    miterLimit: number
}
export interface IStrokeInputData {
    stroke?: IPaint | IPaint[] | IPaintString

    strokeAlign?: IStrokeAlign
    strokeWidth?: number | number[] | IStrokeWidthString
    strokeCap?: IStrokeCap
    strokeJoin?: IStrokeJoin
    dashPattern?: number[] | IDashPatternString
    dashOffset?: number
    miterLimit?: number
}
export interface IStrokeComputedData {
    stroke?: IColorString | ILeafStrokePaint[]

    strokeAlign?: IStrokeAlign
    strokeWidth?: number
    strokeWidths?: number[]
    strokeCap?: IStrokeCap
    strokeJoin?: IStrokeJoin
    dashPattern?: number[]
    dashOffset?: number
    miterLimit?: number
}

// text---
export interface ITextStyleAttrData {
    fontFamily: string
    fontSize: number
    fontWeight: IFontWeight
    italic: boolean
    textCase: ITextCase
    textDecoration: ITextDecoration
    letterSpacing: number | IUnitData
    lineHeight: number | IUnitData

    paraIndent: number
    paraSpacing: number

    textAlign: ITextAlign
    verticalAlign: IVerticalAlign

    textOverflow: IOverflow | string
}
export interface ITextStyleInputData {
    fontFamily?: string
    fontSize?: number
    fontWeight?: IFontWeight
    italic?: boolean
    textCase?: ITextCase
    textDecoration?: ITextDecoration
    letterSpacing?: number | IUnitData
    lineHeight?: number | IUnitData

    paraIndent?: number
    paraSpacing?: number

    textAlign?: ITextAlign
    verticalAlign?: IVerticalAlign

    textOverflow?: IOverflow | string
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

    textAlign?: ITextAlign
    verticalAlign?: IVerticalAlign
    textOverflow?: IOverflow
}

// effect---
export interface IEffectAttrData {
    shadow: IShadowEffect | IShadowEffect[] | IShadowString
    innerShadow: IShadowEffect | IShadowEffect[] | IShadowString
    blur: number | IBlurEffect
    backgroundBlur: number | IBlurEffect
    grayscale: number | IGrayscaleEffect
}
export interface IEffectInputData {
    shadow?: IShadowEffect | IShadowEffect[] | IShadowString
    innerShadow?: IShadowEffect | IShadowEffect[] | IShadowString
    blur?: number | IBlurEffect
    backgroundBlur?: number | IBlurEffect
    grayscale?: number | IGrayscaleEffect
}
export interface IEffectComputedData {
    shadow?: ILeafShadowEffect[]
    innerShadow?: ILeafShadowEffect[]
    blur?: number
    backgroundBlur?: number
    grayscale?: number
}
