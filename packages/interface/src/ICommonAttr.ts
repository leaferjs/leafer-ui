import { IPaint, IStrokeAlign, IStrokeCap, IStrokeJoin, IBlurEffect, IFontWeight, ITextCase, ITextDecoration, IShadowEffect, IGrayscaleEffect } from './type/IType'
import { ILeafStrokePaint, ILeafShadowEffect, ILeafPaint } from './type/IComputedType'
import { IPaintString, IDashPatternString, IPercent, IShadowString, IStringColor, IBorderWidthString, IBorderRadiusString } from './type/IStringType'

// corner---
export interface ICornerRadiusAttrData {
    cornerRadius: number
    cornerSmoothing: number
}
export interface ICornerRadiusInputData {
    cornerRadius?: number
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
    fill?: IStringColor | ILeafPaint[]
}

// border 
export interface IBorderAttrData {
    borderWidth: number | number[] | IBorderWidthString
    borderRadius: number | number[] | IBorderRadiusString
}
export interface IBorderInputData {
    borderWidth?: number | number[]
    borderRadius?: number | number[]
}
export interface IBorderComputedData {
    borderWidth?: number | number[]
    borderRadius?: number | number[]
}

// stroke---
export interface IStrokeAttrData {
    stroke: IPaint | IPaint[] | IPaintString

    strokeAlign: IStrokeAlign
    strokeWidth: number
    strokeCap: IStrokeCap
    strokeJoin: IStrokeJoin
    dashPattern: number[] | IDashPatternString
    dashOffset: number
    miterLimit: number
}
export interface IStrokeInputData {
    stroke?: IPaint | IPaint[] | IPaintString

    strokeAlign?: IStrokeAlign
    strokeWidth?: number
    strokeCap?: IStrokeCap
    strokeJoin?: IStrokeJoin
    dashPattern?: number[] | IDashPatternString
    dashOffset?: number
    miterLimit?: number
}
export interface IStrokeComputedData {
    stroke?: IStringColor | ILeafStrokePaint[]

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
    letterSpacing: number | IPercent
    lineHeight: number | IPercent
    paragraphIndent: number
    paragraphSpacing: number
}
export interface ITextStyleInputData {
    fontFamily?: string
    fontSize?: number
    fontWeight?: IFontWeight
    italic?: boolean
    textCase?: ITextCase
    textDecoration?: ITextDecoration
    letterSpacing?: number | IPercent
    lineHeight?: number | IPercent
    paragraphIndent?: number
    paragraphSpacing?: number
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

    paragraphIndent?: number
    paragraphSpacing?: number
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
