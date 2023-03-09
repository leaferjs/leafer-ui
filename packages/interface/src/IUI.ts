import { ILeaf, ILeafComputedData, ILeafData, ILeafInputData, ILeaferCanvas, IRenderOptions, IPathDrawer, IPointData, IPath2D, IPathCommandData, IWindingRule, IBranch, ILeaferImageConfig, IMatrixData, IBoundsData, __Number } from '@leafer/interface'

import { IPathString, IVectorPathString } from './type/IStringType'
import { IBlendMode } from './type/IType'
import { IVectorPath } from './type/IType'

import {
    IFillAttrData, IFillInputData, IFillComputedData,
    IBorderComputedData,
    ICornerRadiusAttrData, ICornerRadiusInputData, ICornerRadiusComputedData,
    IStrokeAttrData, IStrokeComputedData, IStrokeInputData,
    IEffectAttrData, IEffectInputData, IEffectComputedData,
    ITextStyleAttrData, ITextStyleInputData, ITextStyleComputedData
} from './ICommonAttr'


// Line
export interface ILine extends IUI {
    __: ILineData
    toPoint: IPointData
}
export interface ILineData extends IUIData { }
export interface ILineInputData extends IUIInputData { }


// Rect
export interface IRect extends IUI {
    __: IRectData
}
export interface IRectData extends IUIData { }
export interface IRectInputData extends IUIInputData { }


// Ellipse
export interface IEllipse extends IUI {
    __: IEllipseData
    startAngle: number
    endAngle: number
    innerRadius: number
}
interface IEllipseAttrData {
    startAngle?: number
    endAngle?: number
    innerRadius?: number
}
export interface IEllipseData extends IEllipseAttrData, IUIData { }
export interface IEllipseInputData extends IEllipseAttrData, IUIInputData { }


// Polygon
export interface IPolygon extends IUI {
    __: IPolygonData
    sides: number
}
interface IPolygonAttrData {
    sides?: number
}
export interface IPolygonData extends IPolygonAttrData, IUIData { }
export interface IPolygonInputData extends IPolygonAttrData, IUIInputData { }


// Star
export interface IStar extends IUI {
    __: IStarData
    points: number
    innerRadius: number
}
interface IStarAttrData {
    points?: number
    innerRadius?: number
}

export interface IStarData extends IStarAttrData, IUIData { }
export interface IStarInputData extends IStarAttrData, IUIInputData { }

// Path
export interface IPath extends IUI {
    __: IPathData
    path: IPathCommandData | IPathString
    windingRule: IWindingRule
}
export interface IPathData extends IUIData {
    path?: IPathCommandData
    windingRule?: IWindingRule
}
export interface IPathInputData extends IUIInputData {
    path?: IPathCommandData | IPathString
    windingRule?: IWindingRule
}


// Vector
export interface IVector extends IUI {
    __: IVectorData
    paths: IVectorPath[] | IVectorPathString
}
export interface IVectorData extends IUIData {
    paths?: IVectorPath[]
}
export interface IVectorInputData extends IUIInputData {
    paths?: IVectorPath[] | IVectorPathString
}


// Text
export interface IText extends ITextStyleAttrData, IUI {
    __: ITextData
    content: string
}
interface ITextAttrData {
    content?: string
}
export interface ITextData extends ITextAttrData, ITextStyleComputedData, IUIData {
    __font?: string
}
export interface ITextInputData extends ITextAttrData, ITextStyleInputData, IUIInputData {

}


// Image
export interface IImage extends IRect, ILeaferImageConfig {
    __: IImageData
    url: string
    thumb: string
}
interface IImageAttrData {
    url?: string
    thumb?: string
}
export interface IImageData extends IImageAttrData, IRectData { }
export interface IImageInputData extends IImageAttrData, IUIInputData { }

// Frame
export interface IFrame extends IGroup {
    __: IFrameData
    clip: boolean
    __updateRectBoxBounds(): void
    __updateRectEventBounds(): void
    __updateRectRenderBounds(): void
    __renderRect(canvas: ILeaferCanvas, options: IRenderOptions): void
    __renderGroup(canvas: ILeaferCanvas, options: IRenderOptions): void
}
export interface IFrameData extends IGroupData {
    clip?: boolean
}
export interface IFrameInputData extends IGroupInputData {
    clip?: boolean
}


// Group
export interface IGroup extends IBranch, IUI {
    __: IGroupData
    root?: IGroup
    parent?: IGroup
    children: IUI[]
    add(child: IUI, index?: number): void
    remove(child?: IUI): void
    addAt(child: IUI, index: number): void
    addAfter(child: IUI, after: IUI): void
    addBefore(child: IUI, before: IUI): void
}
export interface IGroupData extends IUIData { }
export interface IGroupInputData extends IUIInputData { }

// UI
export interface IUI extends IFillAttrData, IStrokeAttrData, ICornerRadiusAttrData, IEffectAttrData, ILeaf {
    __: IUIData
    root?: IGroup
    parent?: IGroup
    readonly worldTransform: IMatrixData
    readonly relativeTransform: IMatrixData
    readonly worldBoxBounds: IBoundsData
    readonly worldRenderBounds: IBoundsData
    __drawPathByData(drawer: IPathDrawer, data: IPathCommandData): void
}

export interface IUIData extends IUIComputedData, ILeafData {
    // 非数据属性, 自动计算的缓存数据
    __isFills?: boolean
    __isStrokes?: boolean

    __isTranslucentFill?: boolean  // 半透明的
    __isTranslucentStroke?: boolean

    __useEffect?: boolean

    // path
    path?: IPathCommandData
    windingRule?: IWindingRule

    __pathForRender?: IPathCommandData
    __path2DForRender?: IPath2D

    __strokeOuterWidth?: number // boxBounds外面的笔触宽度
}
export interface IUIComputedData extends IFillComputedData, IBorderComputedData, IStrokeComputedData, ICornerRadiusComputedData, IEffectComputedData, ILeafComputedData {
    blendMode?: IBlendMode
    mask?: boolean
    locked?: boolean
}

export interface IUIInputData extends IFillInputData, IStrokeInputData, ICornerRadiusInputData, IEffectInputData, ILeafInputData {
    blendMode?: IBlendMode
    mask?: boolean
    locked?: boolean
}
