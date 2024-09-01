import { ILeaf, IStateStyleType, IBoolean } from '@leafer-ui/interface'

export interface IStateModule {
    isHover(leaf: ILeaf): boolean
    isPress(leaf: ILeaf): boolean
    isFocus(leaf: ILeaf): boolean
    isDrag(leaf: ILeaf): boolean

    setStyle(leaf: ILeaf, stateType: IStateStyleType, value: IBoolean, isPointerState?: boolean): void
    setState(leaf: ILeaf, stateName: string): void
    updateEventStyle(leaf: ILeaf, eventType: string): void
}