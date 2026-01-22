import { IRadiusPointData } from '@leafer/interface'
import { Platform, Matrix, ImageManager, tempBounds } from '@leafer/core'
import { UI } from '@leafer-ui/draw'


const matrix = new Matrix()
const ui = UI.prototype

ui.__updateHitCanvas = function (): void {

    if (this.__box) this.__box.__updateHitCanvas()

    const { hitCanvasManager } = this.leafer || (this.parent && this.parent.leafer) || {}// 兼容 boxStyle
    if (!hitCanvasManager) return

    const data = this.__
    const isHitPixelFill = (data.__isAlphaPixelFill || data.__isCanvas) && data.hitFill === 'pixel'
    const isHitPixelStroke = data.__isAlphaPixelStroke && data.hitStroke === 'pixel'
    const isHitPixel = isHitPixelFill || isHitPixelStroke

    if (!this.__hitCanvas) this.__hitCanvas = isHitPixel ? hitCanvasManager.getPixelType(this, { contextSettings: { willReadFrequently: true } }) : hitCanvasManager.getPathType(this)

    const h = this.__hitCanvas

    if (isHitPixel) {
        const { renderBounds } = this.__layout
        const size = Platform.image.hitCanvasSize
        const scale = h.hitScale = tempBounds.set(0, 0, size, size).getFitMatrix(renderBounds).a
        const { x, y, width, height } = tempBounds.set(renderBounds).scale(scale)
        h.resize({ width, height, pixelRatio: 1 })
        h.clear()

        ImageManager.patternLocked = true
        this.__renderShape(h, { matrix: matrix.setWith(this.__world).scaleWith(1 / scale).invertWith().translate(-x, -y), snapshot: true, ignoreFill: !isHitPixelFill, ignoreStroke: !isHitPixelStroke }) // 矩阵
        ImageManager.patternLocked = false
        h.resetTransform()

        data.__isHitPixel = true
    } else {
        data.__isHitPixel && (data.__isHitPixel = false)
    }

    this.__drawHitPath(h)
    h.setStrokeOptions(data)

}

ui.__hit = function (inner: IRadiusPointData, forceHitFill?: boolean): boolean {

    if (this.__box && this.__box.__hit(inner)) return true

    // hit pixel
    const data = this.__
    if (data.__isHitPixel && this.__hitPixel(inner)) return true

    // hit path
    const { hitFill } = data
    const needHitFillPath = ((data.fill || data.__isCanvas) && (hitFill === 'path' || (hitFill === 'pixel' && !(data.__isAlphaPixelFill || data.__isCanvas)))) || hitFill === 'all' || forceHitFill
    if (needHitFillPath && this.__hitFill(inner)) return true

    const { hitStroke, __maxStrokeWidth: strokeWidth } = data
    const needHitStrokePath = (data.stroke && (hitStroke === 'path' || (hitStroke === 'pixel' && !data.__isAlphaPixelStroke))) || hitStroke === 'all'
    if (!needHitFillPath && !needHitStrokePath) return false

    const radiusWidth = inner.radiusX * 2
    let hitWidth = radiusWidth

    if (needHitStrokePath) {
        switch (data.strokeAlign) {
            case 'inside':
                hitWidth += strokeWidth * 2
                if (!needHitFillPath && this.__hitFill(inner) && this.__hitStroke(inner, hitWidth)) return true
                hitWidth = radiusWidth
                break
            case 'center':
                hitWidth += strokeWidth
                break
            case 'outside':
                hitWidth += strokeWidth * 2
                if (!needHitFillPath) {
                    if (!this.__hitFill(inner) && this.__hitStroke(inner, hitWidth)) return true
                    hitWidth = radiusWidth
                }
                break
        }
    }

    return hitWidth ? this.__hitStroke(inner, hitWidth) : false
}