import { __Value } from '@leafer/interface'
import { defineDataProcessor, defineKey } from '@leafer/core'

import { IUI } from '@leafer-ui/interface'


export function effectType(defaultValue?: __Value) {
    return (target: IUI, key: string) => {
        defineKey(target, key, {
            get() { return this.__get(key) },
            set(value: __Value) {
                this.root ? this.__set(key, value) : this.__[key] = value
                this.__layout.renderBoundsChanged || this.__layout.renderBoundsChange()
                this.__.__useEffect || (this.__.__useEffect = true)
            }
        })
        defineDataProcessor(target, key, defaultValue)
    }
}
