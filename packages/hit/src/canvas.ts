
import { IPointData, IRadiusPointData, IWindingRule } from '@leafer/interface'
import { LeaferCanvasBase, tempBounds } from '@leafer/core'


const canvas = LeaferCanvasBase.prototype

canvas.hitFill = function (point: IPointData, fillRule?: IWindingRule): boolean {
    return fillRule ? this.context.isPointInPath(point.x, point.y, fillRule) : this.context.isPointInPath(point.x, point.y)
}

canvas.hitStroke = function (point: IPointData, strokeWidth?: number): boolean {
    this.strokeWidth = strokeWidth
    return this.context.isPointInStroke(point.x, point.y)
}

canvas.hitPixel = function (radiusPoint: IRadiusPointData, offset?: IPointData, scale = 1): boolean { // 画布必须有alpha通道
    let { x, y, radiusX, radiusY } = radiusPoint
    if (offset) x -= offset.x, y -= offset.y
    tempBounds.set(x - radiusX, y - radiusY, radiusX * 2, radiusY * 2).scale(scale).ceil()
    const { data } = this.context.getImageData(tempBounds.x, tempBounds.y, tempBounds.width || 1, tempBounds.height || 1)
    for (let i = 0, len = data.length; i < len; i += 4) { if (data[i + 3] > 0) return true }
    return data[3] > 0
}