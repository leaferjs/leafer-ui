import { IGroup, IUI, IBox, IRectInputData, ISelectorProxy, IEditSize, ICursorType, IAlign, IUnitPointData, IDragEvent, IMoveEvent, IRotateEvent, IStroke, IFill, ILeaf, ILeafList, IObject, IBoxInputData, IGroupInputData, IImageCursor, IKeyEvent, IUIInputData, IZoomEvent, IColorString, IDirection4, IPointData, IScaleData, ISkewData, ILayoutBoundsData, ITransition, IFourNumber, IShortcutKeys, IShortcutKeysCheck, IUIEvent, ILeafer } from '@leafer-ui/interface'

export interface IEditorBase extends IGroup, ISelectorProxy, ITransformTool {
    config: IEditorConfig
    readonly mergeConfig: IEditorConfig // 实际使用，合并了选中元素、默认editBox上的editConfig，频繁访问会消耗性能
    readonly mergedConfig: IEditorConfig // 合并之后的缓存配置

    target?: IUI | IUI[]
    hoverTarget?: IUI
    dimTarget?: IGroup | IGroup[] // 需要淡化的容器

    readonly list: IUI[]
    leafList: ILeafList
    openedGroupList: ILeafList

    readonly editing: boolean
    innerEditing: boolean
    readonly groupOpening: boolean

    readonly multiple: boolean
    readonly single: boolean

    readonly dragPoint: IEditPoint // 正在拖拽的控制点

    readonly dragging: boolean
    readonly gesturing: boolean // 手势操作元素中

    readonly moving: boolean
    readonly resizing: boolean
    readonly rotating: boolean
    readonly skewing: boolean

    element?: IUI
    buttons: IGroup

    selector: IGroup
    editBox: IEditBoxBase
    editTool?: IObject
    innerEditor?: IObject
    editMask: IUI

    readonly targetLeafer: ILeafer

    select(target: IUI | IUI[]): void
    cancel(): void

    hasItem(item: IUI): boolean
    getItem(index?: number): IUI
    shiftItem(item: IUI): void
    addItem(item: IUI): void
    removeItem(item: IUI): void

    setDimOthers(value: boolean | number): void
    setBright(value: boolean): void

    update(): void
    updateEditBox(): void

    getEditTool(name: string): IObject
    updateEditTool(): void
    unloadEditTool(): void

    getEditSize(ui: ILeaf): IEditSize

    group(group?: IGroup | IGroupInputData): IGroup
    ungroup(): IUI[]
    openGroup(group: IGroup): void
    closeGroup(group: IGroup): void

    getInnerEditor(name: string): IObject
    openInnerEditor(target?: IUI, nameOrSelect?: string | boolean, select?: boolean): void
    closeInnerEditor(onlyInnerEditor?: boolean): void

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

    spread?: IFourNumber // 扩张编辑框的大小，与实际元素之间产生一定的间隙

    pointFill?: IFill
    pointSize?: number
    pointRadius?: number

    point?: IEditPointInputData | IEditPointInputData[]
    middlePoint?: IEditPointInputData | IEditPointInputData[]
    resizeLine?: IEditPointInputData | IEditPointInputData[]

    rect?: IBoxInputData
    rectThrough?: boolean // 是否穿透rect（穿透后，可以拾取到rect下面的元素，默认单选元素时穿透）

    area?: IRectInputData

    mask?: boolean | IColorString
    dimOthers?: boolean | number // 是否弱化其他内容，突出显示选中元素
    bright?: boolean // 仅突出显示选中元素

    circle?: IEditPointInputData
    circleDirection?: IDirection4
    circleMargin?: number
    rotatePoint?: IEditPointInputData // 改用circle代替，后期可移除

    buttonsDirection?: IDirection4
    buttonsFixed?: boolean | 'AABB' | 'OBB'
    buttonsMargin?: number

    hideOnMove?: boolean
    hideOnSmall?: boolean | number
    hideRotatePoints?: boolean // 是否隐藏透明的旋转控制点
    hideResizeLines?: boolean  // 是否隐藏透明的resize线条

    moveCursor?: ICursorType
    resizeCursor?: IImageCursor
    rotateCursor?: IImageCursor
    skewCursor?: IImageCursor

    around?: IAlign | IUnitPointData // 缩放、旋转、倾斜时围绕的中心点
    rotateAround?: IAlign | IUnitPointData // 单独设置旋转围绕的中心点，比 around 优先级高
    rotateGap?: number
    lockRatio?: boolean | 'corner'
    dragLimitAnimate?: boolean | number // 限制拖动范围的元素，可在拖拽结束时进行动画归位，默认采用 app.config.pointer.dragLimitAnimate 的值
    ignorePixelSnap?: boolean

    selector?: boolean
    editBox?: boolean
    hover?: boolean
    hoverStyle?: IUIInputData
    select?: 'press' | 'tap'
    selectKeep?: boolean
    selectedStyle?: IUIInputData
    selectedPathType?: 'path' | 'render-path'
    multipleSelect?: boolean

    boxSelect?: boolean
    continuousSelect?: boolean // 点击可以连续选择
    openInner?: 'double' | 'long' // 双击/长按打开内部

    moveable?: boolean | 'gesture' | 'move'
    resizeable?: boolean | 'gesture' | 'zoom'
    flipable?: boolean
    rotateable?: boolean | 'gesture' | 'rotate'
    skewable?: boolean

    multipleSelectKey?: IShortcutKeysCheck | IShortcutKeys
    rotateKey?: IShortcutKeysCheck | IShortcutKeys
    diagonalRotateKey?: IShortcutKeysCheck | IShortcutKeys // 对角旋转的快捷键

    beforeSelect?: IEditorBeforeSelect
    beforeEditOuter?: IEditorBeforeEditOuter
    beforeEditInner?: IEditorBeforeEditInner

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

export interface IEditorEditOuterData {
    target: IUI
    name: string
}

export type IEditorEditInnerData = IEditorEditOuterData

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

export interface IEditorBeforeEditOuter {
    (data: IEditorEditOuterData): string | boolean | void
}

export interface IEditorBeforeEditInner {
    (data: IEditorEditInnerData): string | boolean | void
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

export type IEditPointType = 'move' | 'resize' | 'rotate' | 'skew' | 'resize-rotate' | 'button'

export interface IEditBoxBase extends IGroup {

    editor: IEditorBase

    dragging: boolean
    gesturing: boolean // 手势操作元素中

    moving: boolean
    resizing: boolean
    rotating: boolean
    skewing: boolean

    view: IGroup //  放置默认编辑工具控制点

    circle: IEditPoint
    rect: IEditPoint

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

    readonly canUse: boolean // 编辑框是否处于激活状态
    readonly canGesture: boolean // 是否支持手势

    getPointStyle(userStyle?: IBoxInputData): IBoxInputData
    getPointsStyle(): IBoxInputData[]
    getMiddlePointsStyle(): IBoxInputData[]

    load(): void
    update(): void
    unload(): void

    onArrow(e: IKeyEvent): void
    isHoldRotateKey(e: IUIEvent): boolean

}


export interface IEditorDragStartData {
    x: number
    y: number
    totalOffset: IPointData // 缩放、旋转造成的总偏移量，一般用于手势操作的move纠正
    point: IPointData  // 用于移动
    bounds: ILayoutBoundsData // 用于resize
    rotation: number // 用于旋转
}

export interface IEditorConfigFunction {
    (ui: any): IEditorConfig
}

export interface IEditToolFunction {
    (ui: any): string
}
