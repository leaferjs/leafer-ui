import { INumber, IValue, IBoolean, IPathCommandData, IPathString, IPointData, IPathCommandObject, IObject, IFilter, IPathCommandNode } from '@leafer/interface'
import { PathConvert, DataHelper, LeafData, Debug, isArray, isObject, isString, isUndefined } from '@leafer/core'

import { IUI, IUIData, ILeafPaint, IStrokeComputedStyle } from '@leafer-ui/interface'
import { Paint, PaintImage, ColorConvert } from '@leafer-ui/external'


const { parse, objectToCanvasData } = PathConvert
const { stintSet } = DataHelper, { hasTransparent } = ColorConvert
const emptyPaint: ILeafPaint = { originPaint: {} as any }
const debug = Debug.get('UIData')
export class UIData extends LeafData implements IUIData {

    declare public __leaf: IUI

    public get scale(): INumber | IPointData { const { scaleX, scaleY } = this as IUIData; return scaleX !== scaleY ? { x: scaleX, y: scaleY } : scaleX }

    public __blendLayer?: boolean // 非元素属性必须以两个下划线开头

    public __isFills?: boolean
    public __isStrokes?: boolean

    public get __strokeWidth(): number { return this.__getRealStrokeWidth() }

    public get __maxStrokeWidth(): number { const t = this as IUIData; return t.__hasMultiStrokeStyle ? Math.max(t.__hasMultiStrokeStyle, t.strokeWidth) : t.strokeWidth }

    public __hasMultiStrokeStyle?: number // 是否存在多个不同的描述样式（同时存储多个描边样式中的最大宽度用于运算）

    public get __hasMultiPaint(): boolean { const t = this as IUIData; return (t.fill && this.__useStroke) || (t.__isFills && t.fill.length > 1) || (t.__isStrokes && t.stroke.length > 1) || t.__useEffect } // fix: opacity

    public __isAlphaPixelFill?: boolean // png / svg / webp
    public __isAlphaPixelStroke?: boolean

    public __isTransparentFill?: boolean  // 半透明的 
    public __isTransparentStroke?: boolean

    public get __clipAfterFill(): boolean { const t = this as IUIData; return (t.cornerRadius || t.innerShadow || t.__pathInputed) as unknown as boolean } // 用于 (Box | Canvas | Robot) __drawAfterFill() 时裁剪内容
    public get __hasSurface(): boolean { const t = this as IUIData; return (t.fill || t.stroke) as unknown as boolean }

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
        if (isString(value) || !value) {
            stintSet(this, '__isTransparentFill', hasTransparent(value as string))
            this.__isFills && this.__removePaint('fill', true)
            this._fill = value
        } else if (isObject(value)) {
            this.__setPaint('fill', value)
        }
    }

    protected setStroke(value: IValue) {
        if (isString(value) || !value) {
            stintSet(this, '__isTransparentStroke', hasTransparent(value as string))
            this.__isStrokes && this.__removePaint('stroke', true)
            this._stroke = value
        } else if (isObject(value)) {
            this.__setPaint('stroke', value)
        }
    }


    protected setPath(value: IPathCommandData | IPathCommandNode[] | IPathCommandObject[] | IPathString) {
        const isStr = isString(value)
        if (isStr || (value && isObject(value[0]))) {
            this.__setInput('path', value)
            this._path = isStr ? parse(value) : objectToCanvasData(value as IPathCommandObject[])
        } else {
            if (this.__input) this.__removeInput('path')
            this._path = value as IPathCommandData
        }
    }


    protected setShadow(value: IValue) {
        setArray(this, 'shadow', value)
    }

    protected setInnerShadow(value: IValue) {
        setArray(this, 'innerShadow', value)
    }

    protected setFilter(value: IValue) {
        setArray(this, 'filter', value)
    }


    // custom

    public __computePaint(): void {
        const { fill, stroke } = this.__input
        if (fill) Paint.compute('fill', this.__leaf)
        if (stroke) Paint.compute('stroke', this.__leaf)
        this.__needComputePaint = undefined
    }


    public __getRealStrokeWidth(childStyle?: IStrokeComputedStyle): number {
        let { strokeWidth, strokeWidthFixed } = this as IUIData
        if (childStyle) {
            if (childStyle.strokeWidth) strokeWidth = childStyle.strokeWidth
            if (!isUndefined(childStyle.strokeWidthFixed)) strokeWidthFixed = childStyle.strokeWidthFixed
        }
        if (strokeWidthFixed) {
            const scale = this.__leaf.getClampRenderScale()
            return scale > 1 ? strokeWidth / scale : strokeWidth
        } else return strokeWidth
    }


    public __setPaint(attrName: 'fill' | 'stroke', value: IValue): void {
        this.__setInput(attrName, value)
        const layout = this.__leaf.__layout
        layout.boxChanged || layout.boxChange()
        if (isArray(value) && !value.length) {
            this.__removePaint(attrName)
        } else {
            if (attrName === 'fill') this.__isFills = true, this._fill || (this._fill = emptyPaint)
            else this.__isStrokes = true, this._stroke || (this._stroke = emptyPaint)
        }
    }

    public __removePaint(attrName: 'fill' | 'stroke', removeInput?: boolean): void {
        if (removeInput) this.__removeInput(attrName)
        PaintImage.recycleImage(attrName, this)
        if (attrName === 'fill') {
            stintSet(this, '__isAlphaPixelFill', undefined)
            this._fill = this.__isFills = undefined
        } else {
            stintSet(this, '__isAlphaPixelStroke', undefined)
            stintSet(this, '__hasMultiStrokeStyle', undefined)
            this._stroke = this.__isStrokes = undefined
        }
    }
}


function setArray(data: IUIData, key: string, value: IValue) {
    data.__setInput(key, value)
    if (isArray(value)) {
        if (value.some((item: IFilter) => item.visible === false)) value = value.filter((item: IFilter) => item.visible !== false)
        value.length || (value = undefined)
    } else value = value && (value as IFilter).visible !== false ? [value] : undefined;
    (data as IObject)['_' + key] = value
}
