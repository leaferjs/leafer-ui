import { IPointData, IPathCommandData, IWindingRule, IBlendMode, IExportFileType, IMultimediaType, IFourNumber, IAlign, IUnitPointData, IAxis, IAxisReverse, IInterlace, IFilter, IOptionSizeData, ISizeData, IGap, IPointGap, IScaleFixed, IDirection, IImageLOD, IPercentData, IFilmOptions } from '@leafer/interface'
import { IColorString, IPaintString } from './IStringType'
import { IStrokeStyle } from '../ICommonAttr'

export type IPaint = ISolidPaint | IGradientPaint | IImagePaint

export type IStrokePaint = IStrokeSolidPaint | IStrokeGradientPaint | IStrokeImagePaint

export type IFill = IPaint | IPaint[] | IPaintString

export type IStroke = IStrokePaint | IStrokePaint[] | IPaintString

export type IPaintAttr = 'fill' | 'stroke'

export interface IPaintBase {
    type: IPaintType
    blendMode?: IBlendMode
    visible?: boolean
    opacity?: number

    style?: IStrokeStyle
    editing?: boolean // 标记编辑中
    scaleFixed?: IScaleFixed // 不跟随画布缩放
}

export type IPaintType =
    | 'solid'
    | IGradientType
    | IMultimediaType

export type IGradientType =
    | 'linear'
    | 'radial'
    | 'angular'

// ---   
export interface ISolidPaint extends IPaintBase {
    type: 'solid'
    color: IColor
}

export interface IStrokeSolidPaint extends ISolidPaint { }

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
    rotation?: number
    stretch?: number
    stops: IColorStop[] | IColorString[]
}

export interface IStrokeGradientPaint extends IGradientPaint { }

export interface IColorStop {
    offset: number
    color: IColor
    selected?: boolean
}

// ---
export interface IImagePaint extends IPaintBase, IFilmOptions {
    type: IMultimediaType

    url: string
    lod?: IImageLOD

    mode?: IImagePaintMode
    format?: IExportFileType

    filter?: IImageFilters

    padding?: IFourNumber

    align?: IAlign
    offset?: IPointData

    size?: number | IOptionSizeData
    scale?: number | IPointData
    rotation?: number
    skew?: IPointData

    freeTransform?: boolean // 平铺模式下是否进行自由变换，默认90度、缩放会进行特殊处理

    clipSize?: ISizeData

    repeat?: IRepeat
    gap?: IGap | IPointGap
    interlace?: number | IPercentData | IInterlace  // 平铺图案交错排列

    changeful?: boolean // 会频繁变化，不生成图案（有特殊性能优化，一般用于游戏精灵、动图场景）
    sync?: boolean // 同步显示，不走任务列表生成图案
    showProgress?: boolean | IColorString // 是否显示进度
}

export interface IStrokeImagePaint extends IImagePaint { }

export type IImageFilterType =
    | 'exposure' // 曝光
    | 'contrast' // 对比度
    | 'saturation' // 饱和度
    | 'temperature' // 色温
    | 'tint' // 色调
    | 'highlights' // 高光
    | 'shadows' // 阴影
    | (string & {})


export interface IImageFilter {
    type: IImageFilterType
    value: number // -1 ~ 1
}

export type IImageFilters = IImageFilter[]

export type IImagePaintMode = 'normal' | 'cover' | 'fit' | 'stretch' | 'clip' | 'repeat'
export type IRepeat = boolean | 'x' | 'y' | IPointData

// 描边
export type IStrokeAlign = 'inside' | 'outside' | 'center'
export type IStrokeCap = 'none' | 'round' | 'square'
export type IStrokeJoin = 'bevel' | 'round' | 'miter'

// 箭头
export type IArrowType = 'none' | 'angle' | 'angle-side' | 'arrow' | 'triangle' | 'triangle-flip' | 'circle' | 'circle-line' | 'square' | 'square-line' | 'diamond' | 'diamond-line' | 'mark' | (string & {})
export type IArrowStyle = IPathDataArrow | IArrowType | IArrowTypeData

export interface IArrowTypeData {
    type: IArrowType
    scale?: number
    rotation?: number
}

export interface IPathDataArrowMap {
    [name: string]: IPathDataArrow
}

export interface IPathDataArrow {
    connect?: IPathDataArrowOffset // 箭头与线条的连接点位置
    offset?: IPathDataArrowOffset  // 箭头偏移距离，与末端对齐
    path: IPathCommandData
    dashPath?: IPathCommandData // 采用虚线时，需增加填充的内容
    fill?: boolean // 是否进行fill，性能会差一点
}

export interface IPathDataArrowOffset {
    x?: number // 偏移距离（x轴）
    bevelJoin?: number // strokeJoin 为 bevel 时增加的偏移距离（x轴）
    roundJoin?: number // strokeJoin 为 round 时增加的偏移距离（x轴）
}

// 文本
export type ITextAlign =
    | 'left'
    | 'center'
    | 'right'
    | 'justify' // 两端对齐，最后一行不处理，适合段落文本，英文会均分单词
    | 'justify-letter' // 字符级对齐
    | 'both' // 所有行两端对齐，适合单行文本，英文会均分单词
    | 'both-letter' // 字符级对齐

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

export type ITextDecoration = ITextDecorationType | ITextDecorationData
export type ITextDecorationType = 'none' | 'under' | 'delete' | 'under-delete'
export interface ITextDecorationData {
    type: ITextDecorationType
    color: IColor
    offset?: number
}

export type ITextWrap = 'normal' | 'none' | 'break'
export type IWritingMode = IAxis | IAxisReverse

// 路径
export interface IVectorPath {
    rule?: IWindingRule,
    data: string | IPathCommandData
}

// 特效
export interface IShadowEffect {
    x?: number
    y?: number
    blur?: number
    spread?: number
    color?: IColorString | IColor
    blendMode?: IBlendMode
    visible?: boolean
    box?: boolean
    scaleFixed?: IScaleFixed

    // 斜切、缩放、旋转阴影
    skew?: IPointData
    scale?: IPointData
    rotation?: number
    origin?: IDirection // 斜切、旋转原点方位，相对元素的box包围盒，默认为 bottom
}

export interface IBlurEffect {
    blur: number
    visible?: boolean
}

export interface IGrayscaleEffect {
    grayscale: number
    visible?: boolean
}

export interface IEffect extends IFilter {

}

export type IOverflow = 'show' | 'hide' | 'scroll' | 'x-scroll' | 'y-scroll'

export type ITextOverflow = 'show' | 'hide' | 'ellipsis' | (string & {})