import { __Value } from '@leafer/interface'
import { defineLeafAttr } from '@leafer/core'

import { ICanvas, IUI } from '@leafer-ui/interface'


export function effectType(defaultValue?: __Value) {
    return (target: IUI, key: string) => {
        defineLeafAttr(target, key, defaultValue, {
            set(value: __Value) {
                this.__setAttr(key, value)
                if (value) this.__.__useEffect = true
                this.__layout.renderChanged || this.__layout.renderChange()
            }
        })
    }
}

export function resizeType(defaultValue?: __Value) {
    return (target: IUI, key: string) => {
        defineLeafAttr(target, key, defaultValue, {
            set(value: __Value) {
                this.__setAttr(key, value)
                this.__layout.boxChanged || this.__layout.boxChange();
                (this as ICanvas).__updateSize()
            }
        })
    }
}