import { IGroup, IUI, IRectInputData, ISelectorProxy, IEditSize, ICursorType, IAround, IDragEvent, IRotateEvent, IStroke, IFill, ILeafList, ILeaf, IObject, IBoxInputData } from '@leafer-ui/interface'

export interface IEditorBase extends IGroup, ISelectorProxy {
    config: IEditorConfig

    hoverTarget: IUI
    target: IUI | IUI[] | ILeafList

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

    group(): void
    ungroup(): void

    lock(): void
    unlock(): void

    toTop(): void
    toBottom(): void
}

export interface IEditorConfig {
    editSize?: 'auto' | IEditSize

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
    resizeCursor?: ICursorType[]
    rotateCursor?: ICursorType[]

    around?: IAround
    lockRatio?: boolean
    rotateGap?: number

    selector?: boolean
    hover?: boolean
    boxSelect?: boolean

    rotateable?: boolean
    resizeable?: boolean
    skewable?: boolean
}