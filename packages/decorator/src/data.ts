import { IValue, IObject } from '@leafer/interface'
import { defineKey, decorateLeafAttr, attr, UICreator } from '@leafer/core'

import { ICanvas, IUI, IApp, IText } from '@leafer-ui/interface'


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

export function boxStyleType(defaultValue?: IValue) {
    return decorateLeafAttr(defaultValue, (key: string) => attr({
        set(value: IUI) {
            const t = this as IText, { boxStyle } = t.__
            let bgBox = t.__bgBox

            if (value) {

                if (boxStyle) {
                    for (let key in boxStyle) (bgBox as IObject)[key] = undefined
                } else {
                    bgBox = t.__bgBox = UICreator.get('Rect', 0 as any) as IUI
                    bgBox.__layout.boxBounds = this.__layout.boxBounds
                }

                bgBox.set(value)

            } else {

                if (bgBox) {
                    t.__bgBox = bgBox.__layout.boxBounds = undefined
                    bgBox.destroy()
                }

            }

            this.__setAttr(key, value)
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