import { IValue } from '@leafer/interface'
import { defineLeafAttr, doStrokeType } from '@leafer/core'

import { ICanvas, IUI } from '@leafer-ui/interface'


export function arrowType(defaultValue?: IValue) {
    return (target: IUI, key: string) => {
        defineLeafAttr(target, key, defaultValue, {
            set(value: IValue) {
                this.__setAttr(key, value)
                doStrokeType(this)
                const data = (this as IUI).__
                data.__useArrow = data.startArrow !== 'none' || data.endArrow !== 'none'
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