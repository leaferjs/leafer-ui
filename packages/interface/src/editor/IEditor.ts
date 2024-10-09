import { IGroup, IUI, IBox, IRectInputData, ISelectorProxy, IEditSize, ICursorType, IAlign, IUnitPointData, IDragEvent, IRotateEvent, IStroke, IFill, ILeaf, ILeafList, IObject, IBoxInputData, IGroupInputData, IImageCursor, IRect, IBoundsData, IKeyEvent, IUIInputData, IZoomEvent, IColorString, IDirection4 } from '@leafer-ui/interface'

export interface IEditorBase extends IGroup, ISelectorProxy {
    config: IEditorConfig
    readonly mergeConfig: IEditorConfig // 实际使用，合并了选中元素上的editConfig

    hoverTarget?: IUI
    target?: IUI | IUI[]

    readonly list: IUI[]
    leafList: ILeafList
    openedGroupList: ILeafList

    readonly editing: boolean
    innerEditing: boolean
    readonly groupOpening: boolean
    resizeDirection?: number

    readonly multiple: boolean
    readonly single: boolean

    readonly dragging: boolean
    readonly moving: boolean

    element?: IUI
    buttons: IGroup

    selector: IGroup
    editBox: IEditBoxBase
    editTool?: IObject
    innerEditor?: IObject

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

    onMove(e: IDragEvent): void
    onScale(e: IDragEvent | IZoomEvent): void
    onRotate(e: IDragEvent | IRotateEvent): void
    onSkew(e: IDragEvent): void

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

export interface IEditorConfig {
    editSize?: IEditSize
    dualEvent?: boolean
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
    hover?: boolean
    hoverStyle?: IUIInputData
    select?: 'press' | 'tap'
    boxSelect?: boolean
    continuousSelect?: boolean // 点击可以连续选择
    openInner?: 'double' | 'long' // 双击/长按打开内部

    moveable?: boolean | 'move'
    resizeable?: boolean | 'zoom'
    flipable?: boolean
    rotateable?: boolean | 'rotate'
    skewable?: boolean
}

export interface IEditPointInputData extends IBoxInputData {
    direction?: number
    pointType?: IEditPointType
}
export interface IEditPoint extends IBox {
    direction: number
    pointType: IEditPointType
}

export type IEditPointType = 'rotate' | 'resize' | 'button'

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

    readonly flipped: boolean
    readonly flippedX: boolean
    readonly flippedY: boolean
    readonly flippedOne: boolean

    enterPoint: IEditPoint

    getPointStyle(userStyle?: IBoxInputData): IBoxInputData
    getPointsStyle(): IBoxInputData[]
    getMiddlePointsStyle(): IBoxInputData[]

    load(): void
    update(bounds: IBoundsData): void
    unload(): void

    onArrow(e: IKeyEvent): void

}

export interface IEditorConfigFunction {
    (ui: any): IEditorConfig
}

export interface IEditToolFunction {
    (ui: any): string
}
