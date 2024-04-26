import { IGroup, IUI, IRectInputData, ISelectorProxy, IEditSize, ICursorType, IAround, IDragEvent, IRotateEvent, IStroke, IFill, ILeaf, ILeafList, IObject, IBoxInputData, IGroupInputData, IImageCursor } from '@leafer-ui/interface'

export interface IEditorBase extends IGroup, ISelectorProxy {
    config: IEditorConfig
    mergeConfig: IEditorConfig // 实际使用，合并了选中元素上的editConfig

    hoverTarget: IUI
    target: IUI | IUI[]

    readonly list: IUI[]
    leafList: ILeafList
    openedGroupList: ILeafList

    readonly editing: boolean
    innerEditing: boolean
    readonly groupOpening: boolean

    readonly multiple: boolean
    readonly single: boolean

    readonly dragging: boolean

    element: IUI
    buttons: IGroup

    selector: IGroup
    editBox: IGroup
    editTool: IObject
    innerEditor: IObject

    hasItem(item: IUI): boolean
    shiftItem(item: IUI): void
    addItem(item: IUI): void
    removeItem(item: IUI): void

    update(): void
    updateEditTool(): void

    getEditSize(ui: ILeaf): IEditSize

    onMove(e: IDragEvent): void
    onScale(e: IDragEvent): void
    onRotate(e: IDragEvent | IRotateEvent): void
    onSkew(e: IDragEvent): void

    group(group?: IGroup | IGroupInputData): IGroup
    ungroup(): IUI[]
    openGroup(group: IGroup): void
    closeGroup(group: IGroup): void

    openInnerEditor(): void
    closeInnerEditor(): void

    lock(): void
    unlock(): void

    toTop(): void
    toBottom(): void
}

export interface IEditorConfig {
    editSize?: 'auto' | IEditSize
    dualEvent?: boolean
    keyEvent?: boolean

    stroke?: IStroke
    strokeWidth?: number

    pointFill?: IFill
    pointSize?: number
    pointRadius?: number

    point?: IBoxInputData | IBoxInputData[]
    middlePoint?: IBoxInputData | IBoxInputData[]
    rotatePoint?: IBoxInputData

    rect?: IBoxInputData
    area?: IRectInputData

    buttonsDirection?: 'top' | 'right' | 'bottom' | 'left'
    buttonsFixed?: boolean
    buttonsMargin?: number

    hideOnMove?: boolean
    hideOnSmall?: boolean | number

    moveCursor?: ICursorType
    resizeCursor?: IImageCursor
    rotateCursor?: IImageCursor
    skewCursor?: IImageCursor

    around?: IAround
    lockRatio?: boolean | 'corner'
    lockMove?: boolean | 'x' | 'y'
    rotateGap?: number

    selector?: boolean
    hover?: boolean
    select?: 'press' | 'tap'
    boxSelect?: boolean
    continuousSelect?: boolean // 点击可以连续选择
    openInner?: 'double' | 'long' // 双击/长按打开内部

    moveable?: boolean
    rotateable?: boolean
    resizeable?: boolean
    skewable?: boolean
}

export interface IEditorConfigFunction {
    (ui: any): IEditorConfig
}

export interface IEditToolFunction {
    (ui: any): string
}