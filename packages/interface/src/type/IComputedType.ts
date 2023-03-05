import { IPointData } from '@leafer/interface'

import { IStringColor } from './IStringType'
import { IBlendMode, IStrokeAlign, IStrokeJoin, IStrokeCap } from './IType'
import { IPaintType } from './IType'

export type ILeafPaintColor = IStringColor | CanvasGradient | CanvasPattern

export interface ILeafPaint {
    type: IPaintType
    style: ILeafPaintColor
    scale?: IPointData
    blendMode?: IBlendMode
    opacity?: number
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
    color: IStringColor
    blendMode?: IBlendMode
    showBehind?: boolean // 仅用于 DropShadow
}