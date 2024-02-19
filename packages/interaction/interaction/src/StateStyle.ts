import { ILeaf, IObject, IStateStyleType } from '@leafer/interface'

import { PointerEvent } from '@leafer-ui/event'


export function setStateStyle(leaf: ILeaf, stateType: IStateStyleType, pointerState?: boolean): void {

    let style: IObject
    const data = leaf.__ as IObject

    if (pointerState) {

        // hover / press
        style = !hasFixedState(leaf) && data[stateType]

    } else {

        //  disabled > focus > selected
        switch (stateType) {
            case 'disabledStyle':
                style = data[stateType]
                break
            case 'focusStyle':
                style = !leaf.disabled && data[stateType]
                break
            case 'selectedStyle':
                style = !leaf.disabled && !leaf.focus && data[stateType]
                break
        }

    }

    if (style) {
        restoreStyle(leaf) // 先回到正常状态
        leaf.__.__normalStyle = leaf.get(style) as IObject
        leaf.set(style)
    }

}

export function unsetStateStyle(leaf: ILeaf, _stateType: IStateStyleType, pointerState?: boolean): void {

    if (pointerState) {

        if (!hasFixedState(leaf)) {

            restoreStyle(leaf)

            // press > hover
            if (leaf.leafer) {
                const { interaction } = leaf.leafer
                if (interaction.isPress(leaf) && leaf.pressStyle) {
                    setStateStyle(leaf, 'pressStyle', true)
                } else if (interaction.isHover(leaf) && leaf.hoverStyle) {
                    setStateStyle(leaf, 'hoverStyle', true)
                }
            }

        }

    } else {

        //  disabled > focus > selected
        restoreStyle(leaf)

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

function restoreStyle(leaf: ILeaf) {
    const style = leaf.__.__normalStyle
    if (style) {
        leaf.set(style)
        leaf.__.__normalStyle = undefined
    }
}