import { IRadiusPointData } from '@leafer/interface'

import { IUIHitModule } from '@leafer-ui/interface'
import { Platform } from '@leafer/core'


export const UIHit: IUIHitModule = {

    __updateHitCanvas(): void {
        if (!this.__hitCanvas) this.__hitCanvas = this.leafer.hitCanvasManager.getPathType(this)
        const h = this.__hitCanvas
        this.__drawHitPath(h)
        h.setStrokeOptions(this.__)
    },

    __hit(inner: IRadiusPointData): boolean {
        if (Platform.name === 'miniapp') this.__drawHitPath(this.__hitCanvas) // fix: 小程序需要实时更新

        const { fill, hitFill, windingRule } = this.__
        const needHitFill = (fill && hitFill === 'path') || hitFill === 'all'
        const isHitFill = this.__hitFill(inner, windingRule)
        if (needHitFill && isHitFill) return true

        const { stroke, hitStroke, strokeWidth, strokeAlign } = this.__
        const needHitStroke = (stroke && hitStroke === 'path') || hitStroke === 'all'
        const radiusWidth = inner.radiusX * 2

        let hitWidth = radiusWidth

        if (needHitStroke) {
            switch (strokeAlign) {
                case 'inside':
                    hitWidth += strokeWidth * 2
                    if (!needHitFill && (isHitFill && this.__hitStroke(inner, hitWidth))) return true
                    hitWidth = radiusWidth
                    break
                case 'center':
                    hitWidth += strokeWidth
                    break
                case 'outside':
                    hitWidth += strokeWidth * 2
                    if (!needHitFill) {
                        if (!isHitFill && this.__hitStroke(inner, hitWidth)) return true
                        hitWidth = radiusWidth
                    }
                    break
            }
        }

        return hitWidth ? this.__hitStroke(inner, hitWidth) : false
    }

}