import { IRadiusPointData } from '@leafer/interface'
import { BoundsHelper } from '@leafer/core'
import { Rect, UI } from '@leafer-ui/draw'


const ui = new UI()
const rect = Rect.prototype

// hit 

rect.__updateHitCanvas = function () {
    if (this.stroke || this.cornerRadius || (this.fill && this.hitFill === 'pixel') || this.hitStroke === 'all') ui.__updateHitCanvas.call(this)
    else if (this.__hitCanvas) this.__hitCanvas = null
}

rect.__hitFill = function (inner: IRadiusPointData): boolean {
    return this.__hitCanvas ? ui.__hitFill.call(this, inner) : BoundsHelper.hitRadiusPoint(this.__layout.boxBounds, inner)
}