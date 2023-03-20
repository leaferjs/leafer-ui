import { IRadiusPointData } from '@leafer/interface'

import { IUIHitModule } from '@leafer-ui/interface'


const fillVisibleType = ['visible', 'fill-visible']
const fillType = ['all', 'fill']
const strokeVisibleType = ['visible', 'stroke-visible']
const strokeType = ['all', 'stroke']

export const UIHit: IUIHitModule = {

    __hit(local: IRadiusPointData): boolean {
        const { __hitCanvas: h } = this

        const { fill, hitType } = this.__
        const hitFill = (fill && fillVisibleType.includes(hitType)) || fillType.includes(hitType)
        if (hitFill && h.hitPath(local, this.__.windingRule)) return true

        const { stroke, __strokeOuterWidth: outerWidth } = this.__
        const hitStroke = (stroke && strokeVisibleType.includes(hitType)) || strokeType.includes(hitType)
        if (!hitFill && !hitStroke) return false

        const strokeWidth = ((hitStroke ? (outerWidth || 0) : 0) + local.radiusX) * 2
        if (h.strokeWidth !== strokeWidth) {
            h.strokeWidth = strokeWidth
            h.stroke()
        }

        return h.hitStroke(local)
    }

}