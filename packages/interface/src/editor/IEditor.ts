import { IGroup, IUI, IRectInputData, ISelectorProxy, IEditSize, ICursorType, IAround, IDragEvent, IRotateEvent, IStroke, IFill, ILeaf, IObject, IBoxInputData, IGroupInputData, IImageCursor } from '@leafer-ui/interface'

export interface IEditorBase extends IGroup, ISelectorProxy {
    config: IEditorConfig

    hoverTarget: IUI
    target: IUI | IUI[]

    readonly list: IUI[]

    readonly hasTarget: boolean
    readonly multiple: boolean
    readonly single: boolean

    readonly dragging: boolean

    element: IUI
    buttons: IGroup

    selector: IGroup
    editBox: IGroup
    editTool: IObject

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

    lock(): void
    unlock(): void

    toTop(): void
    toBottom(): void
}

export interface IEditorConfig {
    editSize?: 'auto' | IEditSize
    dualEvent?: boolean

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

    moveCursor?: ICursorType
    resizeCursor?: IImageCursor
    rotateCursor?: IImageCursor
    skewCursor?: IImageCursor

    around?: IAround
    lockRatio?: boolean
    rotateGap?: number

    selector?: boolean
    hover?: boolean
    boxSelect?: boolean

    moveable?: boolean
    rotateable?: boolean
    resizeable?: boolean
    skewable?: boolean
}