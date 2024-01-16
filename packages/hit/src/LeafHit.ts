import { IRadiusPointData } from '@leafer/interface'
import { Leaf, PointHelper, BoundsHelper } from '@leafer-ui/draw'


const { toInnerRadiusPointOf, copy, setRadius } = PointHelper
const inner = {} as IRadiusPointData

Leaf.prototype.__hitWorld = function (point: IRadiusPointData): boolean {
    if (this.__layout.hitCanvasChanged || !this.__hitCanvas) {
        this.__updateHitCanvas()
        this.__layout.hitCanvasChanged = false
    }

    if (this.__.hitRadius) {
        copy(inner, point), point = inner
        setRadius(point, this.__.hitRadius)
    }

    toInnerRadiusPointOf(point, this.__world, inner)

    if (this.__.hitBox) {
        if (BoundsHelper.hitRadiusPoint(this.__layout.boxBounds, inner)) return true
    }

    return this.__hit(inner)
}