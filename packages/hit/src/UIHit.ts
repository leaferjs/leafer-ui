import { IRadiusPointData } from '@leafer/interface'

import { IUIHitModule } from '@leafer-ui/interface'


export const UIHit: IUIHitModule = {

    __hit(local: IRadiusPointData): boolean {

        if (this.__.fill) {
            if (this.__hitCanvas.hitPath(local, this.__.windingRule)) return true
        }

        const strokeWidth = ((this.__.__strokeOuterWidth || 0) + local.radiusX) * 2

        if (strokeWidth) {
            const { __hitCanvas: c } = this
            if (c.strokeWidth !== strokeWidth) {
                c.strokeWidth = strokeWidth
                c.stroke()
            }
            if (c.hitStroke(local)) return true
        }

        return false
    }

}