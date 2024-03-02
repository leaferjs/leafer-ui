import { IRadiusPointData } from '@leafer/interface'
import { BoundsHelper } from '@leafer/core'
import { Rect, UI } from '@leafer-ui/draw'


const ui = new UI()

// hit 

Rect.prototype.__updateHitCanvas = function () {
    if (this.stroke || this.cornerRadius) ui.__updateHitCanvas.call(this)
}

Rect.prototype.__hitFill = function (inner: IRadiusPointData, windingRule?: string): boolean {
    return this.__hitCanvas ? ui.__hitFill.call(this, inner, windingRule) : BoundsHelper.hitRadiusPoint(this.__layout.boxBounds, inner)
}