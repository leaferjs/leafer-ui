import { ILeaf, IBoolean, IString, IStateName } from '@leafer-ui/interface'

export interface IStateModule {
    isState(state: IStateName, leaf: ILeaf, button?: ILeaf | boolean): boolean
    isSelected(leaf: ILeaf, button?: ILeaf | boolean): boolean
    isDisabled(leaf: ILeaf, button?: ILeaf | boolean): boolean

    isFocus(leaf: ILeaf, button?: ILeaf | boolean): boolean
    isHover(leaf: ILeaf, button?: ILeaf | boolean): boolean
    isPress(leaf: ILeaf, button?: ILeaf | boolean): boolean

    isDrag(leaf: ILeaf, button?: boolean | ILeaf): boolean

    setStyle(leaf: ILeaf, styleName: IString, value: IBoolean): void
    setState(leaf: ILeaf, stateName: IString): void
    updateEventStyle(leaf: ILeaf, eventType: string): void
}