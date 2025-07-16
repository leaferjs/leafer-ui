import { IBlendMode, ILeaferImage, IMatrixData, IPointData, IScaleFixed, ITaskItem } from '@leafer/interface'

import { IColorString } from './IStringType'
import { IStrokeAlign, IStrokeJoin, IStrokeCap, IImagePaintMode, IImageFilters } from './IType'
import { IPaintType } from './IType'
import { IStrokeComputedStyle } from '../ICommonAttr'

export type ILeafPaintColor = IColorString | CanvasGradient | CanvasPattern

export interface ILeafPaint {
    type?: IPaintType
    style?: ILeafPaintColor
    strokeStyle?: IStrokeComputedStyle // 子描边样式选项
    transform?: IMatrixData // 存在时表示pattern自身不能应用transform
    blendMode?: IBlendMode
    image?: ILeaferImage
    loadId?: number
    patternId?: string
    patternTask?: ITaskItem
    changeful?: boolean // 会频繁变化，不生成图案（有特殊性能优化，一般用于游戏精灵、动图场景）
    sync?: boolean // 同步显示图片，不走任务列表生成图案
    isTransparent?: boolean // 是否为透明色
    data?: ILeafPaintPatternData
    editing?: boolean // 标记编辑中
    scaleFixed?: IScaleFixed // 平铺图片不跟随画布缩放
}

export interface ILeafPaintPatternData {
    width?: number
    height?: number
    scaleX?: number
    scaleY?: number
    gap?: IPointData
    opacity?: number
    transform?: IMatrixData
    filters?: IImageFilters
    mode?: IImagePaintMode
    repeat?: 'repeat' | 'repeat-x' | 'repeat-y'
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
    scaleFixed?: IScaleFixed
}