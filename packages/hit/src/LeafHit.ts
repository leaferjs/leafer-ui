import { IRadiusPointData, ILeaferCanvas } from '@leafer/interface'
import { Leaf, PointHelper, BoundsHelper } from '@leafer/core'


const { toInnerRadiusPointOf, copy, setRadius } = PointHelper
const inner = {} as IRadiusPointData

const leaf = Leaf.prototype

leaf.__hitWorld = function (point: IRadiusPointData): boolean {
    if (this.__layout.hitCanvasChanged || !this.__hitCanvas) {
        this.__updateHitCanvas()
        if (!this.__layout.boundsChanged) this.__layout.hitCanvasChanged = false
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

leaf.__hitFill = function (inner: IRadiusPointData): boolean { return this.__hitCanvas?.hitFill(inner, this.__.windingRule) }

leaf.__hitStroke = function (inner: IRadiusPointData, strokeWidth: number): boolean { return this.__hitCanvas?.hitStroke(inner, strokeWidth) }

leaf.__hitPixel = function (inner: IRadiusPointData): boolean { return this.__hitCanvas?.hitPixel(inner, this.__layout.renderBounds, this.__hitCanvas.hitScale) }

leaf.__drawHitPath = function (canvas: ILeaferCanvas): void { if (canvas) this.__drawRenderPath(canvas) }