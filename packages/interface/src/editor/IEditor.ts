import { IGroup, IUI, IRectInputData, IEditSize, ICursorType, IAround, IDragEvent, IRotateEvent, IStroke, IFill, ILeafList, ILeaf, IObject } from '@leafer-ui/interface'

export interface IEditorBase extends IGroup {
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
    showRotatePoint?: boolean
    showMiddlePoints?: boolean

    editSize?: 'auto' | IEditSize

    around?: IAround
    lockRatio?: boolean
    rotateGap?: number

    stroke?: IStroke
    strokeWidth?: number

    pointFill?: IFill
    pointSize?: number
    pointRadius?: number

    point?: IRectInputData | IRectInputData[]
    rotatePoint?: IRectInputData
    rect?: IRectInputData

    buttonsPosition?: 'top' | 'bottom'
    buttonsMargin?: number

    selector?: boolean
    boxSelect?: boolean
    area?: IRectInputData

    hideOnMove?: boolean
    hideHover?: boolean

    moveCursor?: ICursorType
    resizeCursor?: ICursorType[]
    rotateCursor?: ICursorType[]

    rotateable?: boolean
    resizeable?: boolean
    skewable?: boolean
}