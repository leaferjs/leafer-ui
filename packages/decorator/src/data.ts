import { IValue, IObject } from '@leafer/interface'
import { defineKey, decorateLeafAttr, attr, createDescriptor } from '@leafer/core'

import { ICanvas, IUI, IApp } from '@leafer-ui/interface'


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

export function createAttr(defaultValue?: IValue) {
    return (target: IUI, key: string) => {
        defineKey(target, key, createDescriptor(key, defaultValue))
    }
}