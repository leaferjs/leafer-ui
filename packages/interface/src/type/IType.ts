import { IPointData, IPathCommandData, IWindingRule, IBlendMode, IExportFileType } from '@leafer/interface'
import { IColorString } from './IStringType'

export interface IUnitData {
    type: 'percent' | 'px'
    value: number
}

export type IPaint = ISolidPaint | IGradientPaint | IImagePaint

export interface IPaintBase {
    type: IPaintType
    blendMode?: IBlendMode
    visible?: boolean
    opacity?: number

}

export type IPaintType =
    | 'image'
    | 'solid'
    | IGradientType

export type IGradientType =
    | 'linear'
    | 'radial'
    | 'angular'

// ---   
export interface ISolidPaint extends IPaintBase {
    type: 'solid'
    color: IColor
}

export type IColor = IColorString | IRGB | IRGBA
export interface IRGB {
    r: number
    g: number
    b: number
    a?: number
}
export interface IRGBA extends IRGB {
    a: number
}

// ---
export interface IGradientPaint extends IPaintBase {
    type: IGradientType
    from?: IPointData
    to?: IPointData
    stretch?: number
    stops: IColorStop[]
}
export interface IColorStop {
    offset: number
    color: IColor
}

// ---
export interface IImagePaint extends IPaintBase {
    type: "image"
    url: string
    mode?: IImagePaintMode
    format?: IExportFileType

    filters?: IImageFilters

    offset?: IPointData
    scale?: number | IPointData
    rotation?: number
}
export interface IImageFilters {
    exposure?: number // 曝光
    contrast?: number // 对比度
    saturation?: number // 饱和度
    temperature?: number // 色温
    tint?: number // 色调
    highlights?: number // 高光
    shadows?: number // 阴影
}
export type IImagePaintMode = 'cover' | 'fit' | 'strench' | 'clip' | 'repeat'

// 描边
export type IStrokeAlign = 'inside' | 'outside' | 'center'
export type IStrokeCap = 'none' | 'round' | 'square' | 'arrow-lines' | 'arrow-equilateral'
export type IStrokeJoin = 'bevel' | 'round' | 'miter'

// 文本
export type ITextAlign = 'left' | 'center' | 'right' | 'justify'
export type IVerticalAlign = 'top' | 'middle' | 'bottom'
export type ITextCase = | 'upper' | 'lower' | 'title' | 'none' | 'small-caps'
export type IFontWeight = IFontWeightNumer | IFontWeightString
export type IFontWeightNumer = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
export type IFontWeightString =
    | 'thin'
    | 'extra-light'
    | 'light'
    | 'normal'
    | 'medium'
    | 'semi-bold'
    | 'bold'
    | 'extra-bold'
    | 'black'
export type ITextDecoration = 'none' | 'under' | 'delete'

// 路径
export interface IVectorPath {
    rule?: IWindingRule,
    data: string | IPathCommandData
}

// 特效
export interface IShadowEffect {
    x: number
    y: number
    blur: number
    spread?: number
    color: IColorString | IColor
    blendMode?: IBlendMode
    visible?: boolean
    box?: boolean
}

export interface IBlurEffect {
    blur: number
    visible?: boolean
}

export interface IGrayscaleEffect {
    grayscale: number
    visible?: boolean
}

export type IOverflow = 'show' | 'hide'