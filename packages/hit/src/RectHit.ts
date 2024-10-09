import { IRadiusPointData } from '@leafer/interface'
import { BoundsHelper } from '@leafer/core'
import { UI, Rect, Box } from '@leafer-ui/draw'


const ui = UI.prototype, rect = Rect.prototype, box = Box.prototype

// hit 

rect.__updateHitCanvas = box.__updateHitCanvas = function () {
    if (this.stroke || this.cornerRadius || ((this.fill || this.__.__isCanvas) && this.hitFill === 'pixel') || this.hitStroke === 'all') ui.__updateHitCanvas.call(this)
    else if (this.__hitCanvas) this.__hitCanvas = null
}

rect.__hitFill = box.__hitFill = function (inner: IRadiusPointData): boolean {
    return this.__hitCanvas ? ui.__hitFill.call(this, inner) : BoundsHelper.hitRadiusPoint(this.__layout.boxBounds, inner)
}