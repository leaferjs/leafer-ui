import { IBooleanMap, ILeaferImage, __Value } from '@leafer/interface'
import { ImageManager, LeafData } from '@leafer/core'

import { IShadowEffect, IUI, IUIData, IUnitData, ILeafPaint } from '@leafer-ui/interface'


const emptyPaint: ILeafPaint = {}
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
        if (this.__naturalWidth) this.__naturalWidth = this.__naturalHeight = undefined
        if (typeof value === 'string' || !value) {
            if (this.__isFills) {
                this.__removeInput('fill')
                this.__recycleImage('fill')
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
                this.__recycleImage('stroke')
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

    public __recycleImage(attrName: string): IBooleanMap {
        const paints = (attrName === 'fill' ? this._fill : this._stroke) as ILeafPaint[]
        if (paints instanceof Array) {
            let image: ILeaferImage, map: IBooleanMap
            for (let i = 0, len = paints.length; i < len; i++) {
                image = paints[i].image
                if (image && image.url) {
                    const { url } = image
                    if (!map) map = {}
                    map[url] = true
                    ImageManager.recycle(image)

                    // stop load
                    if (image.loading) {
                        const p = this.__input && this.__input[attrName]
                        const hasSame = p && (p instanceof Array ? p.some(item => item.url === url) : p.url === url)
                        if (!hasSame) image.unload(paints[i].loadId)
                    }
                }
            }
            return map
        }
        return null
    }

}


export const UnitConvert = {

    number(value: number | IUnitData, percentRefer?: number): number {
        if (typeof value === 'object') return value.type === 'percent' ? value.value / 100 * percentRefer : value.value
        return value
    }

} 