import { IMatrixData, IPointData, IPathCommandData } from '@leafer/interface'
import { IStringColor } from './IStringType'

export type IBlendMode =
    | 'pass-through'
    | 'normal'
    | 'multiply'
    | 'screen'
    | 'overlay'
    | 'darken'
    | 'lighten'
    | 'color-dodge'
    | 'color-burn'
    | 'hard-light'
    | 'soft-light'
    | 'difference'
    | 'exclusion'
    | 'hue'
    | 'saturation'
    | 'color'
    | 'luminosity'


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
    | 'gradient-linear'
    | 'gradient-radial'
    | 'gradient-angular'
    | 'gradient-diamond'

// ---   
export interface ISolidPaint extends IPaintBase {
    type: 'solid'
    color: IColor
}

export type IColor = IStringColor // | RGB | RGBA
export interface IRGB {
    r: number
    g: number
    b: number
}
export interface IRGBA extends IRGB {
    a: number
}

// ---
export interface IGradientPaint extends IPaintBase {
    type: IGradientType
    from: IPointData
    to: IPointData
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
    mode: IImagePaintMode
    transform?: IMatrixData
    scale?: number
    rotation?: number
    filters?: IImageFilters
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
export type IImagePaintMode = 'fill' | 'fit' | 'tile' | 'crop'

// 描边
export type IStrokeAlign = 'inside' | 'outside' | 'center'
export type IStrokeCap = 'none' | 'round' | 'square' | 'arrow-lines' | 'arrow-equilateral'
export type IStrokeJoin = 'bevel' | 'round' | 'miter'

// 文本
export type ITextCase = 'upper' | 'lower' | 'title' | 'original' | 'small-caps' | 'small-caps-forced'
export type IFontWeight = IFontWeightNumerical | IFontWeightString
export type IFontWeightNumerical = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
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
export type ITextDecoration = 'none' | 'strikethrough' | 'underline'

// 路径
export interface IVectorPath {
    rule?: IWindingRule,
    data: string | IPathCommandData
}
export type IWindingRule = 'nonzero' | 'evenodd'


// 特效
export interface IShadowEffect {
    x: number
    y: number
    blur: number
    spread?: number
    color: IStringColor | IColor
    blendMode?: IBlendMode
    visible?: boolean
    showBehind?: boolean // 仅用于 DropShadow
}

export interface IBlurEffect {
    blur: number
    visible?: boolean
}

export interface IGrayscaleEffect {
    grayscale: number
    visible?: boolean
}