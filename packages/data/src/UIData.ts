import { __Value } from '@leafer/interface'
import { LeafData } from '@leafer/core'

import { IUIData } from '@leafer-ui/interface'


export class UIData extends LeafData implements IUIData {

    public __isFills?: boolean
    public __isStrokes?: boolean

    protected _fill?: __Value
    protected _stroke?: __Value

    protected _borderWidth?: __Value
    protected _strokeWidth?: number

    protected _shadow?: __Value
    protected _innerShadow?: __Value

    protected setBorderWidth(value: __Value) {
        if (typeof value === 'number') this._strokeWidth = value
        this._borderWidth = value
    }

    protected setFill(value: __Value) {
        if (typeof value === 'string') {
            this._fill = value
            if (this.__isFills) this.__isFills = false
        } else if (value instanceof Array) {
            this._fill = value
            this.__isFills = true
        } else if (typeof value === 'object') {
            this._fill = [value]
            this.__isFills = true
        } else {
            this._fill = value
            if (this.__isFills) this.__isFills = false
        }
    }

    protected setStroke(value: __Value) {
        if (typeof value === 'string') {
            this._stroke = value
            if (this.__isStrokes) this.__isStrokes = false
        } else if (value instanceof Array) {
            this._stroke = value
            this.__isStrokes = true
        } else if (typeof value === 'object') {
            this._stroke = [value]
            this.__isStrokes = true
        } else {
            this._stroke = value
            if (this.__isStrokes) this.__isStrokes = false
        }
    }

    protected setShadow(value: __Value) {
        if (value instanceof Array) {
            this._shadow = value
        } else {
            this._shadow = [value]
        }
    }

    protected setInnerShadow(value: __Value) {
        if (value instanceof Array) {
            this._innerShadow = value
        } else {
            this._innerShadow = [value]
        }
    }

}
