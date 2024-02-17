import { ILeaf, IObject } from '@leafer/interface'

import { PointerEvent } from '@leafer-ui/event'


export function updateStateStyle(leaf: ILeaf, eventType: string): void {
    switch (eventType) {
        case PointerEvent.ENTER:
            setStateStyle(leaf, 'hoverStyle')
            break
        case PointerEvent.LEAVE:
            restoreStateStyle(leaf, 'hoverStyle')
            break
        case PointerEvent.DOWN:
            setStateStyle(leaf, 'pressStyle')
            break
        case PointerEvent.UP:
            restoreStateStyle(leaf, 'pressStyle')
            break
    }
}

function setStateStyle(leaf: ILeaf, stateName: string): void {
    let style: IObject
    const data = leaf.__ as IObject

    if (leaf.selected) {
        style = leaf.selectedStyle
    } else if (leaf.disabled) {
        style = leaf.disabledStyle
    } else {
        style = leaf.__
    }

    const stateStyle = style && style[stateName]
    if (stateStyle) {
        const restoreName = '__' + stateName
        if (!data[restoreName]) {
            data[restoreName] = leaf.get(stateStyle) as IObject
            leaf.set(stateStyle)
        }
    }
}

function restoreStateStyle(leaf: ILeaf, stateName: string): void {
    const data = leaf.__ as IObject, restoreName = '__' + stateName
    if (data[restoreName]) {
        leaf.set(data[restoreName])
        data[restoreName] = undefined
    }
}