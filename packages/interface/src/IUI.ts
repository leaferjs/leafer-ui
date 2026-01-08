import { ILeaf, ILeafComputedData, ILeafData, ILeafInputData, ILeaferCanvas, IRenderOptions, IExportOptions, IExportResult, IPathDrawer, IPointData, IPathCommandData, IBoundsData, IObject, IPathString, ILeaferImage, IPathCreator, IAnswer, IPickOptions, IPickResult, IValue, ICanvasContext2DSettings, IFourNumber, IFindCondition, IBoolean, ICanvasContext2D, IJSONOptions, IMatrixData, ISizeData, ITransition, IAround } from '@leafer/interface'

import {
    IFillAttrData, IFillInputData, IFillComputedData,
    IBorderComputedData,
    ICornerRadiusAttrData, ICornerRadiusInputData, ICornerRadiusComputedData,
    IStrokeAttrData, IStrokeComputedData, IStrokeInputData,
    IEffectAttrData, IEffectInputData, IEffectComputedData,
    ITextStyleAttrData, ITextStyleInputData, ITextStyleComputedData,
    IStrokeComputedStyle
} from './ICommonAttr'
import { IOverflow } from './type/IType'
import { IAnimation, IAnimate, IKeyframe, IKeyframeId, IAnimateType } from './IAnimation'
import { ILeafer } from './app/ILeafer'
import { IEditorConfig } from './editor/IEditor'
import { IColorString } from './type/IStringType'
import { IScroller, IScrollConfig } from './IScroller'
import { ILeafPaint } from './type/IComputedType'

// Line
export interface ILine extends ILineAttrData, IUI {
    __: ILineData
}

interface ILineAttrData {
    toPoint?: IPointData
    points?: number[] | IPointData[]
    curve?: boolean | number
}
export interface ILineData extends ILineAttrData, IUIData { }
export interface ILineInputData extends ILineAttrData, IUIBaseInputData { }


// Arrow
export interface IArrow extends ILine {
    __: IArrowData
}

interface IArrowAttrData {

}
export interface IArrowData extends IArrowAttrData, ILineData { }
export interface IArrowInputData extends IArrowAttrData, ILineInputData { }


// Linker
export interface ILinker extends IArrow {
    __: ILinkerData
}

export interface ILinkerPointData {
    id: string | IUI,
    point?: IAround,
}

interface ILinkerAttrData {
    startPoint?: ILinkerPointData | IUI | string
    endPoint?: ILinkerPointData | IUI | string
}
export interface ILinkerData extends ILinkerAttrData, IArrowData { }
export interface ILinkerInputData extends ILinkerAttrData, IArrowInputData { }


// Flow
export interface IFlow extends IBox {
    __: IFlowData
}

interface IFlowAttrData {

}
export interface IFlowData extends IFlowAttrData, IBoxData { }
export interface IFlowInputData extends IFlowAttrData, IBoxInputData { }



// Video
export interface IVideo extends IPlayerMethods, IRect {
    __: IVideoData
}

interface IPlayerMethods {
    play(): void
    pause(): void
    stop(): void
}

interface IVideoAttrData {
    url?: string
}
export interface IVideoData extends IVideoAttrData, IRectData { }
export interface IVideoInputData extends IVideoAttrData, IRectInputData { }



// GIF
export interface IGIF extends IPlayerMethods, IRect {
    __: IGIFData
}

interface IGIFAttrData {
    url?: string
}
export interface IGIFData extends IGIFAttrData, IRectData { }
export interface IGIFInputData extends IGIFAttrData, IRectInputData { }



// Robot
export interface IRobot extends IRobotAttrData, IPlayerMethods, IRect {
    __: IRobotData
    readonly running: boolean
    readonly nowFrame?: IRobotComputedKeyframe
    readonly robotFrames?: IRobotComputedKeyframe[]

    __updateRobot(): void
    __updateAction(): void
}

interface IRobotAttrData {
    robot?: IRobotKeyframe | IRobotKeyframe[]
    actions?: IRobotActions
    action?: IRobotActionName
    now?: number
    FPS?: number
    loop?: boolean | number
}

export interface IRobotActions {
    [name: string]: IKeyframeId | IKeyframeId[] | IRobotAnimation
}

export interface IRobotAnimation {
    keyframes: IKeyframeId[]
    loop?: boolean | number
    FPS?: number
}

export type IRobotActionName = string

export interface IRobotKeyframe {
    mode?: 'normal' | 'clip'
    url: string

    offset?: IPointData
    size?: number | ISizeData
    total?: number
}

export interface IRobotComputedKeyframe extends IBoundsData {
    view: any
}

export interface IRobotData extends IRobotAttrData, IRectData { }
export interface IRobotInputData extends IRobotAttrData, IRectInputData { }


// Rect
export interface IRect extends IUI {
    __: IRectData
}
export interface IRectData extends IUIData { }
export interface IRectInputData extends IUIBaseInputData { }


// Ellipse
export interface IEllipse extends IUI, IEllipseAttrData {
    __: IEllipseData
}
interface IEllipseAttrData {
    startAngle?: number
    endAngle?: number
    innerRadius?: number
}
export interface IEllipseData extends IEllipseAttrData, IUIData { }
export interface IEllipseInputData extends IEllipseAttrData, IUIBaseInputData { }


// Polygon
export interface IPolygon extends IPolygonAttrData, IUI {
    __: IPolygonData
}
interface IPolygonAttrData {
    sides?: number
    points?: number[] | IPointData[]
    curve?: boolean | number
}
export interface IPolygonData extends IPolygonAttrData, IUIData { }
export interface IPolygonInputData extends IPolygonAttrData, IUIBaseInputData { }


// Star
export interface IStar extends IStarAttrData, IUI {
    __: IStarData
}
interface IStarAttrData {
    corners?: number
    innerRadius?: number
}

export interface IStarData extends IStarAttrData, IUIData { }
export interface IStarInputData extends IStarAttrData, IUIBaseInputData { }

// Path
export interface IPath extends IUI {
    __: IPathData
}
export interface IPathData extends IUIData {
}
export interface IPathInputData extends IUIBaseInputData {
}

// Pen

export interface IPen extends IGroup, IPathCreator {
    __: IPenData
    pathElement: IPath
    pathStyle: IPathInputData
    path: IPathCommandData
    paint(): void
}

export interface IPenData extends IGroupData { }
export interface IPenInputData extends IGroupInputData { }


// Text
export interface IText extends ITextAttrData, ITextStyleAttrData, IUI {
    __: ITextData
}
interface ITextAttrData {
    text?: string | number
    placeholder?: string
    padding?: IFourNumber
    resizeFontSize?: boolean
    boxStyle?: IBackgroundBoxStyle
    textEditing?: boolean
}

export interface IBackgroundBoxStyle extends IRectInputData {

}

export interface ITextData extends ITextAttrData, ITextStyleComputedData, IUIData {
    __baseLine?: number
    __lineHeight?: number
    __letterSpacing?: number
    __padding?: number[]
    __clipText?: boolean
    __isCharMode?: boolean
    __isPlacehold?: boolean
    __textBoxBounds?: IBoundsData
}
export interface ITextInputData extends ITextAttrData, ITextStyleInputData, IUIBaseInputData {

}

export interface ITextRowData {
    x?: number
    y?: number
    width?: number
    height?: number
    text?: string
    data?: ITextCharData[]
    words?: ITextWordData[]

    startCharSize?: number
    endCharSize?: number

    paraStart?: boolean // paragraph start
    paraEnd?: boolean // paragraph end
    isOverflow?: boolean
    textMode?: boolean
}

export interface ITextWordData {
    x?: number
    y?: number
    width?: number
    height?: number
    data?: ITextCharData[]
}

export interface ITextCharData {
    x?: number
    y?: number
    width?: number
    height?: number
    char?: string
}

export interface ITextDrawData {
    bounds: IBoundsData
    rows: ITextRowData[]
    paraNumber: number
    font: string
    maxWidth?: number // 获取最大的行宽，自动宽度 且非 autoSizeAlign 时才有值
    decorationY?: number[]
    decorationColor?: string
    decorationHeight?: number
    overflow?: number // overflowed row number, not index
}

// Image
export interface IImage extends IImageAttrData, IRect {
    __: IImageData
    readonly ready: boolean
    readonly image?: ILeaferImage
}
interface IImageAttrData {
    url?: string
}
export interface IImageData extends IImageAttrData, IRectData {
    __setImageFill(value: string): void
}
export interface IImageInputData extends IImageAttrData, IUIBaseInputData { }

export interface ICanvas extends ICanvasAttrData, IRect {
    __: ICanvasData
    canvas?: ILeaferCanvas
    readonly context?: ICanvasContext2D
    __updateSize(): void
}
interface ICanvasAttrData {
    smooth?: boolean
    safeResize?: boolean
    contextSettings?: ICanvasContext2DSettings
    url?: string
}
export interface ICanvasData extends ICanvasAttrData, IRectData { }
export interface ICanvasInputData extends ICanvasAttrData, IUIBaseInputData { }


// Leafer
export interface ILeaferData extends IGroupData {

}

export interface ILeaferInputData extends IGroupInputData {

}

export interface IAppData extends ILeaferData {

}
export interface IAppInputData extends ILeaferInputData {

}

// Frame
export interface IFrame extends IBox {
    __: IFrameData
}
export interface IFrameData extends IBoxData {

}
export interface IFrameInputData extends IBoxInputData {

}


// Box
export interface IBox extends IBoxAttrData, IGroup {
    __: IBoxData
    scroller?: IScroller
    hasScroller?: boolean
    __checkScroll(isScrollMode: boolean): void
    __updateRectRenderBounds(): void
    __renderGroup(canvas: ILeaferCanvas, options: IRenderOptions): void
}

interface IBoxAttrData {
    overflow?: IOverflow
    scrollConfig?: IScrollConfig
    resizeChildren?: IBoolean
    textBox?: IBoolean // 编辑器中，textBox双击会直接进入编辑文本状态，如便利贴文本
}
export interface IBoxData extends IBoxAttrData, IGroupData { }
export interface IBoxInputData extends IBoxAttrData, IGroupInputData { }


// Group
export interface IGroup extends IUI {
    __: IGroupData
    children: IUI[]
    childlessJSON?: boolean  // 子级 JSON 不导出
    pick(hitPoint: IPointData, options?: IPickOptions): IPickResult
    add(child: IUI | IUI[] | IUIInputData | IUIInputData[], index?: number): void
    addAt(child: IUI | IUI[] | IUIInputData | IUIInputData[], index: number): void
    addAfter(child: IUI | IUI[] | IUIInputData | IUIInputData[], after: IUI): void
    addBefore(child: IUI | IUI[] | IUIInputData | IUIInputData[], before: IUI): void
    addMany(...children: ILeaf[] | IUIInputData[]): void
    remove(child?: IUI | number | string | IFindCondition | IFindUIMethod): void
    removeAll(): void
    clear(): void
}
export interface IGroupData extends IUIData { }
export interface IGroupInputData extends IUIBaseInputData { }

// UI
export interface IUI extends IUIAttrData, IFillAttrData, IStrokeAttrData, ICornerRadiusAttrData, IEffectAttrData, ILeaf {
    __: IUIData

    readonly app: ILeafer
    leafer?: ILeafer
    parent?: IGroup
    zoomLayer?: IGroup
    readonly isFrame?: boolean
    isOverflow?: boolean
    useFastShadow?: boolean // 将忽略 stroke 产生的阴影，只对单个 fill 有效

    proxyData?: IUIInputData
    __proxyData?: IUIInputData

    animation?: IAnimation | IAnimation[]
    animationOut?: IAnimation | IAnimation[]

    children?: IUI[]

    __box?: IUI // 背景box, 一般用于文本背景框
    __animate?: IAnimate

    readonly pen: IPathCreator

    reset(data?: IUIInputData): void

    set(data: IUIInputData, transition?: ITransition | 'temp'): void
    toJSON(options?: IJSONOptions): IUIJSONData

    get<K extends keyof this>(name: K): this[K]
    get<K extends keyof this>(name?: K[] | IUIInputData): IUIInputData

    createProxyData(): IUIInputData

    find(condition: number | string | IFindCondition | IFindUIMethod, options?: any): IUI[]
    findTag(tag: string | string[]): IUI[]
    findOne(condition: number | string | IFindCondition | IFindUIMethod, options?: any): IUI | undefined
    findId(id: number | string): IUI | undefined

    getPath(curve?: boolean, pathForRender?: boolean): IPathCommandData
    getPathString(curve?: boolean, pathForRender?: boolean): IPathString

    load(): void

    __drawPathByData(drawer: IPathDrawer, data: IPathCommandData, ignoreCornerRadius?: boolean): void
    __drawPathByBox(drawer: IPathDrawer, ignoreCornerRadius?: boolean): void
    __drawAfterFill?(canvas: ILeaferCanvas, options: IRenderOptions): void
    __drawContent?(canvas: ILeaferCanvas, options: IRenderOptions): void

    drawImagePlaceholder(image: ILeafPaint, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void

    animate(keyframe?: IUIInputData | IKeyframe[] | IAnimation | IAnimation[], options?: ITransition, type?: IAnimateType, isTemp?: boolean): IAnimate
    killAnimate(type?: IAnimateType, nextStyle?: IUIInputData): void

    export(filename: string, options?: IExportOptions | number | boolean): Promise<IExportResult>
    syncExport(filename: string, options?: IExportOptions | number | boolean): IExportResult
    clone(data?: IUIInputData): IUI
}


export interface IStateStyle extends IUIInputData {

}

export interface IStates {
    [name: string]: IStateStyle
}


export type IStateName = string



interface IUIAttrData {
    animation?: IAnimation | IAnimation[]
    animationOut?: IAnimation | IAnimation[]

    transition?: ITransition
    transitionOut?: ITransition

    states?: IStates
    state?: IStateName

    hoverStyle?: IStateStyle
    pressStyle?: IStateStyle
    focusStyle?: IStateStyle
    selectedStyle?: IStateStyle
    disabledStyle?: IStateStyle
    placeholderStyle?: IStateStyle
    placeholderColor?: IColorString
    placeholderDelay?: number

    editConfig?: IEditorConfig
    editOuter?: string
    editInner?: string
}

export interface IFindUIMethod {
    (leaf: IUI, options?: any): IAnswer
}

export interface IUIData extends IUIAttrData, IUIComputedData, ILeafData {

    readonly scale: number | IPointData

    // 非数据属性, 自动计算的缓存数据
    __isFills?: boolean
    __isStrokes?: boolean

    readonly __strokeWidth: number // 会受 strokeWidthFixed 影响
    readonly __maxStrokeWidth: number
    __hasMultiStrokeStyle?: number // 是否存在多个不同的描述样式（同时存储多个描边样式中的最大宽度用于运算）
    readonly __hasMultiPaint?: boolean

    __isAlphaPixelFill?: boolean // png / svg / webp
    __isAlphaPixelStroke?: boolean

    __isTransparentFill?: boolean  // 半透明的填充色 
    __isTransparentStroke?: boolean

    __isHitPixel?: boolean
    __isCanvas?: boolean // canvas 等需单独绘制的元素
    __isFastShadow?: boolean // 高性能绘制阴影，需满足一定的条件

    __fillAfterStroke?: boolean // 填充在描边之后绘制，一般用于高性能的外描边场景
    __drawAfterFill?: boolean
    readonly __clipAfterFill?: boolean
    readonly __hasSurface?: boolean

    __blendLayer?: boolean

    __boxStroke?: boolean // box闭合描边，可不用计算miterLimit造成的渲染包围盒变化

    // text
    __font?: string
    __textDrawData?: ITextDrawData

    __needComputePaint?: boolean
    __computePaint(): void
    __getRealStrokeWidth(childStyle?: IStrokeComputedStyle): number

    __setPaint(attrName: 'fill' | 'stroke', value: IValue): void
    __removePaint(attrName: 'fill' | 'stroke', removeInput?: boolean): void
}
export interface IUIComputedData extends IUIAttrData, IFillComputedData, IBorderComputedData, IStrokeComputedData, ITextStyleComputedData, ICornerRadiusComputedData, IEffectComputedData, ILeafComputedData {

}

export interface IUIBaseInputData extends IUIAttrData, IFillInputData, IStrokeInputData, ITextStyleInputData, ICornerRadiusInputData, IEffectInputData, ILeafInputData {
    children?: IUIInputData[]
}


export type IUITag =
    | 'App'
    | 'Leafer'
    | 'Rect'
    | 'Ellipse'
    | 'Polygon'
    | 'Star'
    | 'Line'
    | 'Path'
    | 'Pen'
    | 'Text'
    | 'Image'
    | 'Canvas'
    | 'Group'
    | 'Frame'
    | 'Box'
    | 'Arrow'
    | 'Robot'
    | 'GIF'
    | 'Video'


export interface IUIInputData extends IRectInputData, IEllipseInputData, IPolygonInputData, IStarInputData, ILineInputData, IPathInputData, ITextInputData, IImageInputData, IGroupInputData, IBoxInputData, IFrameInputData, IFlowInputData, IArrowInputData, IGIFInputData, IVideoInputData, IRobotInputData, IUIBaseInputData, IObject {
    children?: IUIInputData[]
}

export interface IUIJSONData extends IUIInputData {
    matrix?: IMatrixData
}