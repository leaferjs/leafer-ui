import { ILeaf, IObject, IStateStyleType } from '@leafer/interface'

import { PointerEvent } from '@leafer-ui/event'


export function setStateStyle(leaf: ILeaf, stateType: IStateStyleType, pointerState?: boolean): void {
    const data = leaf.__ as IObject
    let stateStyle: IObject, restoreName: string

    if (pointerState) {

        // hover / press
        restoreName = '__' + stateType
        stateStyle = !hasFixedState(leaf) && data[stateType]

    } else {

        //  disabled > focus > selected
        restoreName = '__stateStyle'
        switch (stateType) {
            case 'disabledStyle':
                stateStyle = data[stateType]
                break
            case 'focusStyle':
                stateStyle = !leaf.disabled && data[stateType]
                break
            case 'selectedStyle':
                stateStyle = !leaf.disabled && !leaf.focus && data[stateType]
                break
        }

        // 先回到正常状态
        if (stateStyle) {
            restoreStyle(leaf, '__pressStyle')
            restoreStyle(leaf, '__hoverStyle')
            restoreStyle(leaf, '__stateStyle')
        }

    }

    if (stateStyle) {
        if (!data[restoreName]) {
            data[restoreName] = leaf.get(stateStyle) as IObject
            leaf.set(stateStyle)
        }
    }

}

export function unsetStateStyle(leaf: ILeaf, stateType: IStateStyleType, pointerState?: boolean): void {
    if (pointerState) {

        // hover / press
        if (!hasFixedState(leaf)) restoreStyle(leaf, '__' + stateType)

    } else {

        //  disabled > focus > selected
        restoreStyle(leaf, '__stateStyle')

        if (leaf.disabled && leaf.disabledStyle) {
            setStateStyle(leaf, 'disabledStyle')
        } else if (leaf.focus && leaf.focusStyle) {
            setStateStyle(leaf, 'focusStyle')
        } else if (leaf.selected && leaf.selectedStyle) {
            setStateStyle(leaf, 'selectedStyle')
        }

    }
}

export function updateEventStyle(leaf: ILeaf, eventType: string): void {
    switch (eventType) {
        case PointerEvent.ENTER:
            setStateStyle(leaf, 'hoverStyle', true)
            break
        case PointerEvent.LEAVE:
            unsetStateStyle(leaf, 'hoverStyle', true)
            break
        case PointerEvent.DOWN:
            setStateStyle(leaf, 'pressStyle', true)
            break
        case PointerEvent.UP:
            unsetStateStyle(leaf, 'pressStyle', true)
            break
    }
}


function hasFixedState(leaf: ILeaf): boolean {
    return leaf.focus || leaf.selected || leaf.disabled
}

function restoreStyle(leaf: ILeaf, restoreName: string) {
    const data = leaf.__ as IObject
    if (data[restoreName]) {
        leaf.set(data[restoreName])
        data[restoreName] = undefined
    }
}