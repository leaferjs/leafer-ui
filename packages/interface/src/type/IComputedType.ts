import { IBlendMode, ILeaferImage, IMatrixData } from '@leafer/interface'

import { IColorString } from './IStringType'
import { IStrokeAlign, IStrokeJoin, IStrokeCap, IImagePaintMode } from './IType'
import { IPaintType } from './IType'

export type ILeafPaintColor = IColorString | CanvasGradient | CanvasPattern

export interface ILeafPaint {
    type?: IPaintType
    style?: ILeafPaintColor
    transform?: IMatrixData
    blendMode?: IBlendMode
    opacity?: number
    image?: ILeaferImage
    loadId?: number
    patternId?: string
    data?: ILeafPaintPatternData
}

export interface ILeafPaintPatternData {
    width?: number
    height?: number
    scaleX?: number
    scaleY?: number
    opacity?: number
    transform?: IMatrixData
    mode?: IImagePaintMode
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
    x: number
    y: number
    blur: number
    spread?: number
    color: IColorString
    blendMode?: IBlendMode
    box?: boolean
}