import { IRadiusPointData } from '@leafer/interface'

import { IUIHitModule } from '@leafer-ui/interface'


export const UIHit: IUIHitModule = {

    __hit(local: IRadiusPointData): boolean {
        const { __hitCanvas: h } = this

        if (this.__.fill && h.hitPath(local, this.__.windingRule)) return true

        const strokeWidth = ((this.__.__strokeOuterWidth || 0) + local.radiusX) * 2
        if (h.strokeWidth !== strokeWidth) {
            h.strokeWidth = strokeWidth
            h.stroke()
        }

        return h.hitStroke(local)
    }

}