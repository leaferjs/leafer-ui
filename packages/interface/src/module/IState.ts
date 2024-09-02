import { ILeaf, IBoolean, IString } from '@leafer-ui/interface'

export interface IStateModule {
    isHover(leaf: ILeaf): boolean
    isPress(leaf: ILeaf): boolean
    isFocus(leaf: ILeaf): boolean
    isDrag(leaf: ILeaf): boolean

    setStyle(leaf: ILeaf, styleName: IString, value: IBoolean): void
    setState(leaf: ILeaf, stateName: IString): void
    updateEventStyle(leaf: ILeaf, eventType: string): void
}