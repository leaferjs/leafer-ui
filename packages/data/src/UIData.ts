import { __Value } from '@leafer/interface'
import { LeafData } from '@leafer/core'

import { IShadowEffect, IUI, IUIData, IUnitData } from '@leafer-ui/interface'
import { Paint } from '@leafer-ui/external'


export class UIData extends LeafData implements IUIData {

    public __leaf: IUI

    public __blendLayer?: boolean

    public __isFills?: boolean
    public __isStrokes?: boolean

    protected _fill?: __Value
    protected _stroke?: __Value

    protected _shadow?: __Value
    protected _innerShadow?: __Value


    protected setFill(value: __Value) {
        if (typeof value === 'string' || !value) {
            this._fill = value
            if (this.__input) this.__removeInput('fill')
            this.__isFills && (this.__isFills = false)
        } else if (typeof value === 'object') {
            this.__setInput('fill', value)
            this.__leaf.__layout.boxChanged ? this._fill = value : Paint.computeFill(this.__leaf)
            this.__isFills = true
        }
        if (this.__naturalWidth) this.__naturalWidth = this.__naturalHeight = undefined
    }

    protected setStroke(value: __Value) {
        if (typeof value === 'string' || !value) {
            this._stroke = value
            if (this.__input) this.__removeInput('stroke')
            this.__isStrokes && (this.__isStrokes = false)
        } else if (typeof value === 'object') {
            this.__setInput('stroke', value)
            this.__leaf.__layout.boxChanged ? this._stroke = value : Paint.computeStroke(this.__leaf)
            this.__isStrokes = true
        }
    }

    protected setShadow(value: __Value) {
        this.__setInput('shadow', value)
        if (value instanceof Array) {
            if (value.some((item: IShadowEffect) => item.visible === false)) value = value.filter((item: IShadowEffect) => item.visible !== false)
            this._shadow = value.length ? value : null
        } else if (value) {
            this._shadow = (value as IShadowEffect).visible === false ? null : [value]
        } else {
            this._shadow = null
        }
    }

    protected setInnerShadow(value: __Value) {
        this.__setInput('innerShadow', value)
        if (value instanceof Array) {
            if (value.some((item: IShadowEffect) => item.visible === false)) value = value.filter((item: IShadowEffect) => item.visible !== false)
            this._innerShadow = value.length ? value : null
        } else if (value) {
            this._innerShadow = (value as IShadowEffect).visible === false ? null : [value]
        } else {
            this._innerShadow = null
        }
    }

}


export const UnitConvert = {

    number(value: number | IUnitData, percentRefer?: number): number {
        if (typeof value === 'object') return value.type === 'percent' ? value.value / 100 * percentRefer : value.value
        return value
    }

} 