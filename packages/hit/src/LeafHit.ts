import { IRadiusPointData, ILeaferCanvas } from '@leafer/interface'
import { Leaf, PointHelper, BoundsHelper } from '@leafer/core'


const { toInnerRadiusPointOf, copy, setRadius } = PointHelper
const inner = {} as IRadiusPointData

const leaf = Leaf.prototype

leaf.__hitWorld = function (point: IRadiusPointData): boolean {
    const data = this.__
    if (!data.hitSelf) return false

    const world = this.__world, layout = this.__layout
    const isSmall = world.width < 10 && world.height < 10

    if (data.hitRadius) {
        copy(inner, point), point = inner
        setRadius(point, data.hitRadius)
    }

    toInnerRadiusPointOf(point, world, inner)

    if (data.hitBox || isSmall) {
        if (BoundsHelper.hitRadiusPoint(layout.boxBounds, inner)) return true
        if (isSmall) return false
    }

    if (layout.hitCanvasChanged || !this.__hitCanvas) {
        this.__updateHitCanvas()
        if (!layout.boundsChanged) layout.hitCanvasChanged = false
    }

    return this.__hit(inner)
}

leaf.__hitFill = function (inner: IRadiusPointData): boolean { return this.__hitCanvas?.hitFill(inner, this.__.windingRule) }

leaf.__hitStroke = function (inner: IRadiusPointData, strokeWidth: number): boolean { return this.__hitCanvas?.hitStroke(inner, strokeWidth) }

leaf.__hitPixel = function (inner: IRadiusPointData): boolean { return this.__hitCanvas?.hitPixel(inner, this.__layout.renderBounds, this.__hitCanvas.hitScale) }

leaf.__drawHitPath = function (canvas: ILeaferCanvas): void { if (canvas) this.__drawRenderPath(canvas) }