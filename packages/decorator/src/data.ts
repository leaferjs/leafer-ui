import { IStateStyleType, IValue, IObject } from '@leafer/interface'
import { defineKey, defineLeafAttr, doStrokeType } from '@leafer/core'

import { ICanvas, IUI } from '@leafer-ui/interface'


let focusUI: IUI

export function stateType(defaultValue?: IValue) {
    return (target: IUI, key: string) => {
        const stateType = key + 'Style' as IStateStyleType
        defineLeafAttr(target, key, defaultValue, {
            set(value: IValue) {
                this.__setAttr(key, value)
                this.waitLeafer(() => {
                    const { interaction } = this.leafer
                    if (interaction) {
                        if (value) {
                            if (key === 'focus') {
                                if (focusUI) focusUI.focus = false
                                focusUI = this as IUI
                            }
                            interaction.setStateStyle(this, stateType)
                        } else {
                            interaction.unsetStateStyle(this, stateType)
                        }
                    }
                })
            }
        })
    }
}

export function arrowType(defaultValue?: IValue) {
    return (target: IUI, key: string) => {
        defineLeafAttr(target, key, defaultValue, {
            set(value: IValue) {
                this.__setAttr(key, value)
                const data = (this as IUI).__
                data.__useArrow = data.startArrow !== 'none' || data.endArrow !== 'none'
                doStrokeType(this)
            }
        })
    }
}

export function effectType(defaultValue?: IValue) {
    return (target: IUI, key: string) => {
        defineLeafAttr(target, key, defaultValue, {
            set(value: IValue) {
                this.__setAttr(key, value)
                if (value) (this as IUI).__.__useEffect = true
                this.__layout.renderChanged || this.__layout.renderChange()
            }
        })
    }
}

export function resizeType(defaultValue?: IValue) {
    return (target: IUI, key: string) => {
        defineLeafAttr(target, key, defaultValue, {
            set(value: IValue) {
                this.__setAttr(key, value)
                this.__layout.boxChanged || this.__layout.boxChange();
                (this as ICanvas).__updateSize()
            }
        })
    }
}

export function zoomLayerType() {
    return (target: IUI, key: string) => {
        const privateKey = '_' + key
        defineKey(target, key, {
            set(value: IUI) { if (this.isLeafer) (this as IObject)[privateKey] = value },
            get() { return this.isLeafer ? ((this as IObject)[privateKey] || this) : this.leafer && this.leafer.zoomLayer }
        })
    }
}