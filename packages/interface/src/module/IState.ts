import { ILeaf, IBoolean, IString } from '@leafer-ui/interface'

export interface IStateModule {
    isHover(leaf: ILeaf, checkButton?: boolean): boolean
    isPress(leaf: ILeaf, checkButton?: boolean): boolean
    isFocus(leaf: ILeaf, checkButton?: boolean): boolean
    isDrag(leaf: ILeaf, checkButton?: boolean): boolean

    setStyle(leaf: ILeaf, styleName: IString, value: IBoolean): void
    setState(leaf: ILeaf, stateName: IString): void
    updateEventStyle(leaf: ILeaf, eventType: string): void
}