import { IUIBoundsModule } from "@leafer-ui/interface"

import { Filter } from '@leafer-ui/external'


export const UIBounds: IUIBoundsModule = {

    __updateStrokeSpread(): number {
        let width = 0, boxWidth = 0
        const data = this.__, { strokeAlign, __maxStrokeWidth: strokeWidth } = data, box = this.__box

        if ((data.stroke || data.hitStroke === 'all') && strokeWidth && strokeAlign !== 'inside') {
            boxWidth = width = strokeAlign === 'center' ? strokeWidth / 2 : strokeWidth

            if (!data.__boxStroke) {
                const miterLimitAddWidth = data.__isLinePath ? 0 : 10 * width  // =  Math.sin((miterLimit = 10) * OneRadian / 2) * Math.sqrt(strokeWidth) - width 后期需继续精确优化
                const storkeCapAddWidth = data.strokeCap === 'none' ? 0 : strokeWidth
                width += Math.max(miterLimitAddWidth, storkeCapAddWidth)
            }
        }

        if (data.__useArrow) width += strokeWidth * 5 // 后期需要精细化

        if (box) {
            width = Math.max(box.__layout.strokeSpread = box.__updateStrokeSpread(), width)
            boxWidth = box.__layout.strokeBoxSpread
        }

        this.__layout.strokeBoxSpread = boxWidth

        return width
    },

    __updateRenderSpread(): number {
        let width: number = 0
        const { shadow, innerShadow, blur, backgroundBlur, filter, spread } = this.__

        if (shadow) shadow.forEach(item => width = Math.max(width, Math.max(Math.abs(item.y), Math.abs(item.x)) + (item.spread > 0 ? item.spread : 0) + item.blur * 1.5))

        if (blur) width = Math.max(width, blur)

        if (filter) width += Filter.getSpread(filter)

        if (spread) width += spread

        let shapeWidth = width = Math.ceil(width)

        if (innerShadow) innerShadow.forEach(item => shapeWidth = Math.max(shapeWidth, Math.max(Math.abs(item.y), Math.abs(item.x)) + (item.spread < 0 ? -item.spread : 0) + item.blur * 1.5))

        if (backgroundBlur) shapeWidth = Math.max(shapeWidth, backgroundBlur)

        this.__layout.renderShapeSpread = shapeWidth

        width += this.__layout.strokeSpread || 0

        return this.__box ? Math.max(this.__box.__updateRenderSpread(), width) : width
    }

}