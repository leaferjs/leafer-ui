import { INumber, IValue, IBoolean, IPathCommandData, IPathString, IPointData, IPathCommandObject } from '@leafer/interface'
import { PathConvert, LeafData, Debug } from '@leafer/core'

import { IShadowEffect, IUI, IUIData, ILeafPaint } from '@leafer-ui/interface'
import { Paint, PaintImage } from '@leafer-ui/external'


const { parse, objectToCanvasData } = PathConvert
const emptyPaint: ILeafPaint = {}
const debug = Debug.get('UIData')
export class UIData extends LeafData implements IUIData {

    declare public __leaf: IUI

    public get scale(): INumber | IPointData { const { scaleX, scaleY } = this as IUIData; return scaleX !== scaleY ? { x: scaleX, y: scaleY } : scaleX }

    public __blendLayer?: boolean // 非元素属性必须以两个下划线开头

    public __isFills?: boolean
    public __isStrokes?: boolean

    public get __strokeWidth(): number {
        const { strokeWidth, strokeWidthFixed } = this as IUIData
        if (strokeWidthFixed) {
            const ui = this.__leaf
            let { scaleX } = ui.__nowWorld || ui.__world
            if (scaleX < 0) scaleX = -scaleX
            return scaleX > 1 ? strokeWidth / scaleX : strokeWidth
        } else return strokeWidth
    }

    public get __hasStroke(): boolean { return (this as IUIData).stroke && (this as IUIData).strokeWidth as unknown as boolean }

    public __pixelFill?: boolean // png / svg / webp
    public __pixelStroke?: boolean

    public get __clipAfterFill(): boolean { return ((this as IUIData).cornerRadius || (this as IUIData).__pathInputed) as unknown as boolean } // 用于 __drawAfterFill()

    public __needComputePaint: boolean

    protected _visible?: IBoolean

    protected _width?: INumber
    protected _height?: INumber

    protected _fill?: IValue
    protected _stroke?: IValue

    protected _path: IPathCommandData

    protected _shadow?: IValue
    protected _innerShadow?: IValue

    public get __autoWidth() { return !this._width }
    public get __autoHeight() { return !this._height }
    public get __autoSide() { return !this._width || !this._height }
    public get __autoSize() { return !this._width && !this._height }


    protected setVisible(value: IBoolean) {
        this._visible = value

        const { leafer } = this.__leaf
        if (leafer) leafer.watcher.hasVisible = true
    }

    protected setWidth(value: INumber) {
        if (value < 0) {
            this._width = -value
            this.__leaf.scaleX *= -1
            debug.warn('width < 0, instead -scaleX ', this)
        } else this._width = value
    }

    protected setHeight(value: INumber) {
        if (value < 0) {
            this._height = -value
            this.__leaf.scaleY *= -1
            debug.warn('height < 0, instead -scaleY', this)
        } else this._height = value
    }


    protected setFill(value: IValue) {
        if (this.__naturalWidth) this.__removeNaturalSize()
        if (typeof value === 'string' || !value) {
            if (this.__isFills) {
                this.__removeInput('fill')
                PaintImage.recycleImage('fill', this)
                this.__isFills = false
                if (this.__pixelFill) this.__pixelFill = false
            }
            this._fill = value
        } else if (typeof value === 'object') {
            this.__setInput('fill', value)
            this.__leaf.__layout.boxChanged || this.__leaf.__layout.boxChange()
            this.__isFills = true
            this._fill || (this._fill = emptyPaint)
        }
    }

    protected setStroke(value: IValue) {
        if (typeof value === 'string' || !value) {
            if (this.__isStrokes) {
                this.__removeInput('stroke')
                PaintImage.recycleImage('stroke', this)
                this.__isStrokes = false
                if (this.__pixelStroke) this.__pixelStroke = false
            }
            this._stroke = value
        } else if (typeof value === 'object') {
            this.__setInput('stroke', value)
            this.__leaf.__layout.boxChanged || this.__leaf.__layout.boxChange()
            this.__isStrokes = true
            this._stroke || (this._stroke = emptyPaint)
        }
    }


    protected setPath(value: IPathCommandData | IPathCommandObject[] | IPathString) {
        const isString = typeof value === 'string'
        if (isString || (value && typeof value[0] === 'object')) {
            this.__setInput('path', value)
            this._path = isString ? parse(value) : objectToCanvasData(value as IPathCommandObject[])
        } else {
            if (this.__input) this.__removeInput('path')
            this._path = value as IPathCommandData
        }
    }


    protected setShadow(value: IValue) {
        this.__setInput('shadow', value)
        if (value instanceof Array) {
            if (value.some((item: IShadowEffect) => item.visible === false)) value = value.filter((item: IShadowEffect) => item.visible !== false)
            this._shadow = value.length ? value : null
        } else this._shadow = value && (value as IShadowEffect).visible !== false ? [value] : null
    }

    protected setInnerShadow(value: IValue) {
        this.__setInput('innerShadow', value)
        if (value instanceof Array) {
            if (value.some((item: IShadowEffect) => item.visible === false)) value = value.filter((item: IShadowEffect) => item.visible !== false)
            this._innerShadow = value.length ? value : null
        } else this._innerShadow = value && (value as IShadowEffect).visible !== false ? [value] : null
    }

    // custom

    public __computePaint(): void {
        const { fill, stroke } = this.__input
        if (fill) Paint.compute('fill', this.__leaf)
        if (stroke) Paint.compute('stroke', this.__leaf)
        this.__needComputePaint = false
    }

}