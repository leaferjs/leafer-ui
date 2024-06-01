import { IStateStyleType, IValue, IObject } from '@leafer/interface'
import { defineKey, decorateLeafAttr, attr, doStrokeType } from '@leafer/core'

import { ICanvas, IUI, IApp } from '@leafer-ui/interface'
import { State } from '@leafer-ui/external'


export function stateType(defaultValue?: IValue) {
    return decorateLeafAttr(defaultValue, (key: string) => attr({
        set(value: IValue) {
            this.__setAttr(key, value)
            this.waitLeafer(() => { if (State.setStyle) State.setStyle(this, key + 'Style' as IStateStyleType, value as boolean) })
        }
    }))
}

export function arrowType(defaultValue?: IValue) {
    return decorateLeafAttr(defaultValue, (key: string) => attr({
        set(value: IValue) {
            if (this.__setAttr(key, value)) {
                const data = (this as IUI).__
                data.__useArrow = data.startArrow !== 'none' || data.endArrow !== 'none'
                doStrokeType(this)
            }
        }
    }))
}

export function effectType(defaultValue?: IValue) {
    return decorateLeafAttr(defaultValue, (key: string) => attr({
        set(value: IValue) {
            this.__setAttr(key, value)
            if (value) (this as IUI).__.__useEffect = true
            this.__layout.renderChanged || this.__layout.renderChange()
        }
    }))
}

export function resizeType(defaultValue?: IValue) {
    return decorateLeafAttr(defaultValue, (key: string) => attr({
        set(value: IValue) {
            this.__setAttr(key, value)
            this.__layout.boxChanged || this.__layout.boxChange();
            (this as ICanvas).__updateSize()
        }
    }))
}

export function zoomLayerType() {
    return (target: IUI, key: string) => {
        const privateKey = '_' + key
        defineKey(target, key, {
            set(value: IUI) { if (this.isLeafer) (this as IObject)[privateKey] = value },
            get() {
                return this.isApp
                    ? (this as IApp).tree.zoomLayer
                    : (this.isLeafer ? ((this as IObject)[privateKey] || this) : this.leafer && this.leafer.zoomLayer)
            }
        })
    }
}