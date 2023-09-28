import { __Number, __Value, __Boolean } from '@leafer/interface'
import { LeafData, Debug } from '@leafer/core'

import { IShadowEffect, IUI, IUIData, IUnitData, ILeafPaint } from '@leafer-ui/interface'
import { Paint } from '@leafer-ui/external'


const emptyPaint: ILeafPaint = {}
const debug = Debug.get('UIData')
export class UIData extends LeafData implements IUIData {

    declare public __leaf: IUI

    public __blendLayer?: boolean

    public __isFills?: boolean
    public __isStrokes?: boolean

    protected _visible?: __Boolean

    protected _width?: __Number
    protected _height?: __Number

    protected _fill?: __Value
    protected _stroke?: __Value

    protected _shadow?: __Value
    protected _innerShadow?: __Value


    protected setVisible(value: __Boolean) {
        if (this.__leaf.leafer) this.__leaf.leafer.watcher.hasVisible = true
        this._visible = value
    }

    protected setWidth(value: __Number) {
        if (value < 0) {
            this._width = -value
            this.__leaf.scaleX *= -1
            debug.warn('width < 0, instead -scaleX ', this)
        } else {
            this._width = value
        }
    }

    protected setHeight(value: __Number) {
        if (value < 0) {
            this._height = -value
            this.__leaf.scaleY *= -1
            debug.warn('height < 0, instead -scaleY', this)
        } else {
            this._height = value
        }
    }


    protected setFill(value: __Value) {
        if (this.__naturalWidth) this.__naturalWidth = this.__naturalHeight = undefined
        if (typeof value === 'string' || !value) {
            if (this.__isFills) {
                this.__removeInput('fill')
                Paint.recycleImage('fill', this)
                this.__isFills = false
            }
            this._fill = value
        } else if (typeof value === 'object') {
            this.__setInput('fill', value)
            this.__leaf.__layout.boxChanged || this.__leaf.__layout.boxChange()
            this.__isFills = true
            this._fill || (this._fill = emptyPaint)
        }
    }

    protected setStroke(value: __Value) {
        if (typeof value === 'string' || !value) {
            if (this.__isStrokes) {
                this.__removeInput('stroke')
                Paint.recycleImage('stroke', this)
                this.__isStrokes = false
            }
            this._stroke = value
        } else if (typeof value === 'object') {
            this.__setInput('stroke', value)
            this.__leaf.__layout.boxChanged || this.__leaf.__layout.boxChange()
            this.__isStrokes = true
            this._stroke || (this._stroke = emptyPaint)
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