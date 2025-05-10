import { ILeaf, IBoolean, IString, IObject, IStateName, IStateStyle } from '@leafer-ui/interface'

export interface IStateModule {

    canAnimate: boolean
    animateExcludes: IObject // 动画中排除的状态属性

    isState(state: IStateName, leaf: ILeaf, button?: ILeaf | boolean): boolean
    isSelected(leaf: ILeaf, button?: ILeaf | boolean): boolean
    isDisabled(leaf: ILeaf, button?: ILeaf | boolean): boolean

    isFocus(leaf: ILeaf, button?: ILeaf | boolean): boolean
    isHover(leaf: ILeaf, button?: ILeaf | boolean): boolean
    isPress(leaf: ILeaf, button?: ILeaf | boolean): boolean
    isPlacehold(leaf: ILeaf, button?: ILeaf | boolean): boolean

    isDrag(leaf: ILeaf, button?: boolean | ILeaf): boolean

    setStyleName(leaf: ILeaf, styleName: IString, value: IBoolean): void
    set(leaf: ILeaf, stateName: IString): void

    getStyle(leaf: ILeaf): IStateStyle

    updateStyle(leaf: ILeaf, style?: IStateStyle, type?: 'in' | 'out'): void
    updateEventStyle(leaf: ILeaf, eventType: string): void
}