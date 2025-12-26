import { IRadiusPointData, ILeaferCanvas, IPointData, IBranch } from '@leafer/interface'
import { Leaf, PointHelper, BoundsHelper, Platform } from '@leafer/core'


const { toInnerRadiusPointOf, copyRadiusPoint } = PointHelper
const { hitRadiusPoint, hitPoint } = BoundsHelper
const inner = {} as IRadiusPointData, worldRadiusPoint = {} as IRadiusPointData

const leaf = Leaf.prototype

leaf.hit = function (worldPoint: IPointData, hitRadius: number = 0): boolean {
    this.updateLayout()

    copyRadiusPoint(worldRadiusPoint, worldPoint, hitRadius)

    const world = this.__world
    if (hitRadius ? !hitRadiusPoint(world, worldRadiusPoint) : !hitPoint(world, worldRadiusPoint)) return false

    return this.isBranch ? Platform.getSelector(this).hitPoint({ ...worldRadiusPoint }, hitRadius, { target: this as unknown as IBranch }) : this.__hitWorld(worldRadiusPoint)
}

leaf.__hitWorld = function (point: IRadiusPointData, forceHitFill?: boolean): boolean {
    const data = this.__
    if (!data.hitSelf) return false

    const world = this.__world, layout = this.__layout
    const isSmall = world.width < 10 && world.height < 10

    if (data.hitRadius) {
        copyRadiusPoint(inner, point, data.hitRadius)
        point = inner
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

    return this.__hit(inner, forceHitFill)
}

leaf.__hitFill = function (inner: IRadiusPointData): boolean { const h = this.__hitCanvas; return h && h.hitFill(inner, this.__.windingRule) }

leaf.__hitStroke = function (inner: IRadiusPointData, strokeWidth: number): boolean { const h = this.__hitCanvas; return h && h.hitStroke(inner, strokeWidth) }

leaf.__hitPixel = function (inner: IRadiusPointData): boolean { const h = this.__hitCanvas; return h && h.hitPixel(inner, this.__layout.renderBounds, h.hitScale) }

leaf.__drawHitPath = function (canvas: ILeaferCanvas): void { canvas && this.__drawRenderPath(canvas) }