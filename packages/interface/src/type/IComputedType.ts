import { IBlendMode, IDirection, IInterlace, ILeaferImage, IMatrixData, IPointData, IScaleFixed, ITaskItem } from '@leafer/interface'

import { IColorString } from './IStringType'
import { IStrokeAlign, IStrokeJoin, IStrokeCap, IImagePaintMode, IImageFilters, IPaint } from './IType'
import { IPaintType } from './IType'
import { IStrokeComputedStyle } from '../ICommonAttr'

export type ILeafPaintColor = IColorString | CanvasGradient | CanvasPattern

export interface ILeafPaint {
    type?: IPaintType
    style?: ILeafPaintColor
    strokeStyle?: IStrokeComputedStyle // 子描边样式选项
    transform?: IMatrixData // 存在时表示pattern自身不能应用transform
    image?: ILeaferImage

    level?: number // pattern level
    drawLevel?: number // drawImage level

    loadId?: number
    patternId?: string
    patternTask?: ITaskItem
    progressTimer?: any

    isTransparent?: boolean // 是否为透明色
    data?: ILeafPaintPatternData
    originPaint?: IPaint // 原始paint对象
}

export interface ILeafPaintPatternData {
    scaleX?: number
    scaleY?: number
    gap?: IPointData
    opacity?: number
    transform?: IMatrixData
    filters?: IImageFilters
    mode?: IImagePaintMode
    repeat?: 'repeat' | 'repeat-x' | 'repeat-y'
    interlace?: IInterlace
}

export type ILeafFill = ILeafPaint

export interface ILeafStrokePaint extends ILeafPaint {
    strokeAlign?: IStrokeAlign
    strokeWidth?: number
    strokeCap?: IStrokeCap
    strokeJoin?: IStrokeJoin
    dashPattern?: number[]
    miterLimit?: number
}

export interface ILeafShadowEffect {
    x?: number
    y?: number
    blur?: number
    spread?: number
    color?: IColorString
    blendMode?: IBlendMode
    box?: boolean
    scaleFixed?: IScaleFixed

    // 斜切、缩放、旋转阴影
    skew?: IPointData
    scale?: IPointData
    rotation?: number
    origin?: IDirection // 斜切、旋转原点方位，相对元素的box包围盒，默认为 bottom
}