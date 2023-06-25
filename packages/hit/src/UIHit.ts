import { IRadiusPointData } from '@leafer/interface'

import { IUIHitModule } from '@leafer-ui/interface'


export const UIHit: IUIHitModule = {

    __updateHitCanvas(): void {
        if (!this.__hitCanvas) this.__hitCanvas = this.leafer.hitCanvasManager.getPathType(this)
        this.__drawHitPath(this.__hitCanvas)
        this.__hitCanvas.setStrokeOptions(this.__)
    },

    __hit(inner: IRadiusPointData): boolean {
        const { __hitCanvas: h } = this

        const { fill, hitFill, windingRule } = this.__
        const needHitFill = (fill && hitFill === 'path') || hitFill === 'all'
        if (needHitFill && h.hitFill(inner, windingRule)) return true

        const { stroke, hitStroke, strokeWidth, strokeAlign } = this.__
        const needHitStroke = (stroke && hitStroke === 'path') || hitStroke === 'all'
        const radiusWidth = inner.radiusX * 2
        let hitWidth = (needHitStroke ? (strokeAlign === 'center' ? strokeWidth / 2 : strokeWidth) : 0) * 2 + radiusWidth
        if (!hitWidth) return false

        switch (strokeAlign) {
            case 'inside':
                if (!needHitFill && (h.hitFill(inner, windingRule) && h.hitStroke(inner, hitWidth))) return true
                hitWidth = radiusWidth
                break
            case 'outside':
                if (!needHitFill) {
                    if (!h.hitFill(inner, windingRule) && h.hitStroke(inner, hitWidth)) return true
                    hitWidth = radiusWidth
                }
        }

        return hitWidth ? h.hitStroke(inner, hitWidth) : false
    }

}