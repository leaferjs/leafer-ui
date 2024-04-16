import { IRadiusPointData } from '@leafer/interface'
import { BoundsHelper } from '@leafer/core'
import { Rect, UI } from '@leafer-ui/draw'


const ui = new UI()
const rect = Rect.prototype

// hit 

rect.__updateHitCanvas = function () {
    if (this.stroke || this.cornerRadius) ui.__updateHitCanvas.call(this)
}

rect.__hitFill = function (inner: IRadiusPointData): boolean {
    return this.__hitCanvas ? ui.__hitFill.call(this, inner) : BoundsHelper.hitRadiusPoint(this.__layout.boxBounds, inner)
}