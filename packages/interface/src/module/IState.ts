import { ILeaf, IStateStyleType } from '@leafer/interface'

export interface IStateModule {
    isHover(leaf: ILeaf): boolean
    isPress(leaf: ILeaf): boolean
    isFocus(leaf: ILeaf): boolean
    isDrag(leaf: ILeaf): boolean

    setStyle(leaf: ILeaf, stateType: IStateStyleType, value: boolean): void
    updateEventStyle(leaf: ILeaf, eventType: string): void
}