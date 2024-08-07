import { IPointData, IPathCommandData, IWindingRule, IBlendMode, IExportFileType, ISizeData, IFourNumber, IAlign, IUnitPointData } from '@leafer/interface'
import { IColorString, IPaintString } from './IStringType'

export type IPaint = ISolidPaint | IGradientPaint | IImagePaint

export type IFill = IPaint | IPaint[] | IPaintString

export type IStroke = IPaint | IPaint[] | IPaintString

export type IPaintAttr = 'fill' | 'stroke'

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
    from?: IAlign | IUnitPointData
    to?: IAlign | IUnitPointData
    stretch?: number
    stops: IColorStop[] | IColorString[]
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

    padding?: IFourNumber

    align?: IAlign
    offset?: IPointData

    size?: number | ISizeData
    scale?: number | IPointData
    rotation?: number

    repeat?: IRepeat
    sync?: boolean // 同步显示，不走任务列表生成图案
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
export type IImagePaintMode = 'normal' | 'cover' | 'fit' | 'stretch' | 'clip' | 'repeat'
export type IRepeat = boolean | 'x' | 'y'

// 描边
export type IStrokeAlign = 'inside' | 'outside' | 'center'
export type IStrokeCap = 'none' | 'round' | 'square'
export type IStrokeJoin = 'bevel' | 'round' | 'miter'

// 箭头
export type IArrowType = IPathDataArrow | 'none' | 'angle' | 'angle-side' | 'arrow' | 'triangle' | 'triangle-flip' | 'circle' | 'circle-line' | 'square' | 'square-line' | 'diamond' | 'diamond-line' | 'mark'

export interface IPathDataArrowMap {
    [name: string]: IPathDataArrow
}

export interface IPathDataArrow {
    connect?: IPathDataArrowOffset // 箭头与线条的连接点位置
    offset?: IPathDataArrowOffset  // 箭头偏移距离，与末端对齐
    path: IPathCommandData
}

export interface IPathDataArrowOffset {
    x?: number // 偏移距离（x轴）
    bevelJoin?: number // strokeJoin 为 bevel 时增加的偏移距离（x轴）
    roundJoin?: number // strokeJoin 为 round 时增加的偏移距离（x轴）
}

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
export type ITextWrap = 'normal' | 'none' | 'break'

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