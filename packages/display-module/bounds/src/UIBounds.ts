import { IUIBoundsModule } from "@leafer-ui/interface"


export const UIBounds: IUIBoundsModule = {

    __updateStrokeSpread(): number {
        let width = 0, boxWidth = 0
        const { stroke, hitStroke, strokeAlign, strokeWidth } = this.__

        if ((stroke || hitStroke === 'all') && strokeWidth && strokeAlign !== 'inside') {
            boxWidth = width = strokeAlign === 'center' ? strokeWidth / 2 : strokeWidth

            if (!this.__.__boxStroke) {
                const { strokeCap, path } = this.__
                const miterLimitAddWidth = (path && path.length > 6) ? 10 * width : 0 // =  Math.sin((miterLimit = 10) * OneRadian / 2) * Math.sqrt(strokeWidth) - width 后期需继续精确优化
                const storkeCapAddWidth = strokeCap === 'none' ? 0 : strokeWidth
                width += Math.max(miterLimitAddWidth, storkeCapAddWidth)
            }
        }

        if (this.__.__useArrow) width += strokeWidth * 5 // 后期需要精细化

        this.__layout.strokeBoxSpread = boxWidth

        return width
    },

    __updateRenderSpread(): number {
        let width: number = 0
        const { shadow, innerShadow, blur, backgroundBlur } = this.__

        if (shadow) shadow.forEach(item => {
            width = Math.max(width, Math.max(Math.abs(item.y), Math.abs(item.x)) + (item.spread > 0 ? item.spread : 0) + item.blur * 1.5)
        })

        if (blur) width = Math.max(width, blur)

        let shapeWidth = width = Math.ceil(width)

        if (innerShadow) innerShadow.forEach(item => {
            shapeWidth = Math.max(shapeWidth, Math.max(Math.abs(item.y), Math.abs(item.x)) + (item.spread < 0 ? -item.spread : 0) + item.blur * 1.5)
        })

        if (backgroundBlur) shapeWidth = Math.max(shapeWidth, backgroundBlur)

        this.__layout.renderShapeSpread = shapeWidth

        return width + (this.__layout.strokeSpread || 0)
    }

}