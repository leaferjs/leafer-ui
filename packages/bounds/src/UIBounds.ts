import { OneRadian } from '@leafer/core'

import { IUIBoundsModule } from "@leafer-ui/interface"


export const UIBounds: IUIBoundsModule = {

    __updateEventBoundsSpreadWidth(): number {
        let width: number = 0
        const { stroke, strokeAlign } = this.__

        if (stroke && strokeAlign !== 'inside') {

            const { strokeWidth, miterLimit, path } = this.__
            const miterLength = path ? 1 / Math.sin(miterLimit * OneRadian / 2) * Math.sqrt(strokeWidth) : 0 // miterlimit 导致增加的长度
            width = strokeAlign === 'center' ? strokeWidth / 2 : strokeWidth
            this.__.__strokeOuterWidth = width

            if (miterLength) width += (miterLength - width)

        }

        if (!width) this.__.__strokeOuterWidth = 0

        return width
    },

    __updateRenderBoundsSpreadWidth(): number {
        let width: number = 0
        const { shadow, innerShadow, blur, backgroundBlur } = this.__

        if (shadow) shadow.forEach(item => {
            width = Math.max(width, Math.max(Math.abs(item.y), Math.abs(item.x)) + (item.spread > 0 ? item.spread : 0) + item.blur * 1.5)
        })

        if (blur) width = Math.max(width, blur)


        let other = width = Math.ceil(width)

        if (innerShadow) innerShadow.forEach(item => {
            other = Math.max(other, Math.max(Math.abs(item.y), Math.abs(item.x)) + (item.spread < 0 ? -item.spread : 0) + item.blur * 1.5)
        })

        if (backgroundBlur) other = Math.max(other, backgroundBlur)
        this.__layout.renderShapeBoundsSpreadWidth = other

        return width
    }

}