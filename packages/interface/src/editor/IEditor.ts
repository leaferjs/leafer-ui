import { IGroup, IUI, IBox, IRectInputData, ISelectorProxy, IEditSize, ICursorType, IAlign, IUnitPointData, IDragEvent, IMoveEvent, IRotateEvent, IStroke, IFill, ILeaf, ILeafList, IObject, IBoxInputData, IGroupInputData, IImageCursor, IRect, IKeyEvent, IUIInputData, IZoomEvent, IColorString, IDirection4, IPointData, IScaleData, ISkewData, ILayoutBoundsData, ITransition } from '@leafer-ui/interface'

export interface IEditorBase extends IGroup, ISelectorProxy, ITransformTool {
    config: IEditorConfig
    readonly mergeConfig: IEditorConfig // 实际使用，合并了选中元素上的editConfig，频繁访问会消耗性能
    readonly mergedConfig: IEditorConfig // 合并之后的缓存配置

    hoverTarget?: IUI
    target?: IUI | IUI[]

    readonly list: IUI[]
    leafList: ILeafList
    openedGroupList: ILeafList

    readonly editing: boolean
    innerEditing: boolean
    readonly groupOpening: boolean

    readonly multiple: boolean
    readonly single: boolean

    readonly dragging: boolean
    readonly moving: boolean
    readonly dragPoint: IEditPoint // 正在拖拽的控制点

    element?: IUI
    buttons: IGroup

    selector: IGroup
    editBox: IEditBoxBase
    editTool?: IObject
    innerEditor?: IObject
    editMask: IUI

    select(target: IUI | IUI[]): void
    cancel(): void

    hasItem(item: IUI): boolean
    shiftItem(item: IUI): void
    addItem(item: IUI): void
    removeItem(item: IUI): void

    update(): void
    updateEditBox(): void
    updateEditTool(): void

    getEditSize(ui: ILeaf): IEditSize

    group(group?: IGroup | IGroupInputData): IGroup
    ungroup(): IUI[]
    openGroup(group: IGroup): void
    closeGroup(group: IGroup): void

    openInnerEditor(target?: IUI, select?: boolean): void
    closeInnerEditor(): void

    lock(): void
    unlock(): void

    toTop(): void
    toBottom(): void
}

export interface ITransformTool {
    editBox: IEditBoxBase
    editTool?: IObject

    onMove(e: IDragEvent | IMoveEvent): void
    onScale(e: IDragEvent | IZoomEvent): void
    onRotate(e: IDragEvent | IRotateEvent): void
    onSkew(e: IDragEvent): void

    move(x: number | IPointData, y?: number, transition?: ITransition): void
    scaleOf(origin: IPointData | IAlign, scaleX: number, scaleY?: number | ITransition, resize?: boolean, transition?: ITransition): void
    rotateOf(origin: IPointData | IAlign, rotation: number, transition?: ITransition): void
    skewOf(origin: IPointData | IAlign, skewX: number, skewY?: number, resize?: boolean, transition?: ITransition): void
}


export interface IEditorConfig extends IObject {
    editSize?: IEditSize
    keyEvent?: boolean

    stroke?: IStroke
    strokeWidth?: number

    pointFill?: IFill
    pointSize?: number
    pointRadius?: number

    point?: IEditPointInputData | IEditPointInputData[]
    middlePoint?: IEditPointInputData | IEditPointInputData[]

    rect?: IBoxInputData
    area?: IRectInputData
    mask?: boolean | IColorString

    circle?: IEditPointInputData
    circleDirection?: IDirection4
    circleMargin?: number
    rotatePoint?: IEditPointInputData // 改用circle代替，后期可移除

    buttonsDirection?: IDirection4
    buttonsFixed?: boolean | 'AABB' | 'OBB'
    buttonsMargin?: number

    hideOnMove?: boolean
    hideOnSmall?: boolean | number

    moveCursor?: ICursorType
    resizeCursor?: IImageCursor
    rotateCursor?: IImageCursor
    skewCursor?: IImageCursor

    around?: IAlign | IUnitPointData
    lockRatio?: boolean | 'corner'
    rotateGap?: number

    selector?: boolean
    editBox?: boolean
    hover?: boolean
    hoverStyle?: IUIInputData
    select?: 'press' | 'tap'
    selectedStyle?: IUIInputData
    multipleSelect?: boolean
    boxSelect?: boolean
    continuousSelect?: boolean // 点击可以连续选择
    openInner?: 'double' | 'long' // 双击/长按打开内部

    moveable?: boolean | 'move'
    resizeable?: boolean | 'zoom'
    flipable?: boolean
    rotateable?: boolean | 'rotate'
    skewable?: boolean

    beforeSelect?: IEditorBeforeSelect
    beforeMove?: IEditorBeforeMove
    beforeScale?: IEditorBeforeScale
    beforeRotate?: IEditorBeforeRotate
    beforeSkew?: IEditorBeforeSkew

    preventEditInner?: boolean // 仅阻止交互事件触发内部编辑

    textEditor?: IObject
    pathEditor?: IObject
}

export interface IEditorSelectData {
    target: IUI | IUI[]
}

export interface IEditorMoveData extends IPointData, IObject {
    target: IUI
}

export interface IEditorScaleData extends IScaleData, IObject {
    target: IUI
    origin: IPointData | IAlign
}

export interface IEditorRotationData extends IObject {
    target: IUI
    origin: IPointData | IAlign
    rotation: number
}

export interface IEditorSkewData extends ISkewData, IObject {
    target: IUI
    origin: IPointData | IAlign
}

export interface IEditorBeforeSelect {
    (data: IEditorSelectData): IUI | IUI[] | boolean | void
}

export interface IEditorBeforeMove {
    (data: IEditorMoveData): IPointData | boolean | void
}

export interface IEditorBeforeScale {
    (data: IEditorScaleData): IScaleData | boolean | void
}

export interface IEditorBeforeRotate {
    (data: IEditorRotationData): number | boolean | void
}

export interface IEditorBeforeSkew {
    (data: IEditorSkewData): ISkewData | boolean | void
}


export interface IEditPointInputData extends IBoxInputData {
    direction?: number
    pointType?: IEditPointType
}
export interface IEditPoint extends IBox {
    direction: number
    pointType: IEditPointType
}

export type IEditPointType = 'resize' | 'rotate' | 'skew' | 'resize-rotate' | 'button'

export interface IEditBoxBase extends IGroup {

    editor: IEditorBase

    dragging: boolean
    moving: boolean

    view: IGroup //  放置默认编辑工具控制点

    circle: IEditPoint
    rect: IRect

    buttons: IGroup

    resizePoints: IEditPoint[]
    rotatePoints: IEditPoint[]
    resizeLines: IEditPoint[]

    enterPoint: IEditPoint
    dragPoint: IEditPoint // 正在拖拽的控制点

    dragStartData: IEditorDragStartData

    config: IEditorConfig
    readonly mergeConfig: IEditorConfig // 合并了config与编辑器的mergeConfig，频繁访问会消耗性能
    readonly mergedConfig: IEditorConfig // 实际使用，合并之后的缓存配置

    target: IUI // 操作的元素，默认为editor.element
    single: boolean // 是否单选元素

    transformTool: ITransformTool

    readonly flipped: boolean
    readonly flippedX: boolean
    readonly flippedY: boolean
    readonly flippedOne: boolean

    getPointStyle(userStyle?: IBoxInputData): IBoxInputData
    getPointsStyle(): IBoxInputData[]
    getMiddlePointsStyle(): IBoxInputData[]

    load(): void
    update(): void
    unload(): void

    onArrow(e: IKeyEvent): void

}


export interface IEditorDragStartData {
    x: number
    y: number
    point: IPointData
    bounds: ILayoutBoundsData
    rotation: number
}

export interface IEditorConfigFunction {
    (ui: any): IEditorConfig
}

export interface IEditToolFunction {
    (ui: any): string
}
