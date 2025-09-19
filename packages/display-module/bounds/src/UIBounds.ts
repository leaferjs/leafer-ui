import { IFourNumber } from '@leafer/interface'
import { FourNumberHelper } from '@leafer/core'

import { IUIBoundsModule } from "@leafer-ui/interface"
import { Effect, Filter } from '@leafer-ui/external'


const { max, add } = FourNumberHelper

export const UIBounds: IUIBoundsModule = {

    __updateStrokeSpread(): IFourNumber {
        let spread: IFourNumber = 0, boxSpread = 0
        const data = this.__, { strokeAlign, __maxStrokeWidth: strokeWidth } = data, box = this.__box

        if ((data.stroke || data.hitStroke === 'all') && strokeWidth && strokeAlign !== 'inside') {
            boxSpread = spread = strokeAlign === 'center' ? strokeWidth / 2 : strokeWidth

            if (!data.__boxStroke) {
                const miterLimitAddWidth = data.__isLinePath ? 0 : 10 * spread  // =  Math.sin((miterLimit = 10) * OneRadian / 2) * Math.sqrt(strokeWidth) - width 后期需继续精确优化
                const storkeCapAddWidth = data.strokeCap === 'none' ? 0 : strokeWidth
                spread += Math.max(miterLimitAddWidth, storkeCapAddWidth)
            }
        }

        if (data.__useArrow) spread += strokeWidth * 5 // 后期需要精细化

        if (box) {
            spread = max(spread, box.__layout.strokeSpread = box.__updateStrokeSpread())
            boxSpread = Math.max(boxSpread, box.__layout.strokeBoxSpread)
        }

        this.__layout.strokeBoxSpread = boxSpread

        return spread
    },

    __updateRenderSpread(): IFourNumber {
        let spread: IFourNumber = 0
        const { shadow, innerShadow, blur, backgroundBlur, filter, renderSpread } = this.__, { strokeSpread } = this.__layout, box = this.__box

        if (shadow) spread = Effect.getShadowRenderSpread(this, shadow)

        if (blur) spread = max(spread, blur)

        if (filter) spread = add(spread, Filter.getSpread(filter))

        if (renderSpread) spread = add(spread, renderSpread)

        if (strokeSpread) spread = add(spread, strokeSpread)


        let shapeSpread = spread

        if (innerShadow) shapeSpread = max(shapeSpread, Effect.getInnerShadowSpread(this, innerShadow))

        if (backgroundBlur) shapeSpread = max(shapeSpread, backgroundBlur)

        this.__layout.renderShapeSpread = shapeSpread

        return box ? max(box.__updateRenderSpread(), spread) : spread
    }

}