import { IRadiusPointData } from '@leafer/interface'
import { Platform, Matrix } from '@leafer/core'
import { UI, ImageManager } from '@leafer-ui/draw'


const matrix = new Matrix()

UI.prototype.__updateHitCanvas = function (): void {
    const data = this.__, { hitCanvasManager } = this.leafer
    data.__hitPixelFill = data.__pixelFill && data.hitFill === 'pixel'
    data.__hitPixelStroke = data.__pixelStroke && data.hitStroke === 'pixel'
    const hitPixel = data.__hitPixelFill || data.__hitPixelStroke
    const { x, y, width, height } = this.__layout.renderBounds

    if (!this.__hitCanvas) this.__hitCanvas = hitPixel ? hitCanvasManager.getImageType(this, { width, height, pixelRatio: 1, contextSettings: { willReadFrequently: true } }) : hitCanvasManager.getPathType(this)

    const h = this.__hitCanvas

    if (hitPixel) {
        h.resize({ width, height, pixelRatio: 1 })
        const scale = h.hitScale = 0.5
        ImageManager.patternLocked = true
        this.__renderShape(h, { matrix: matrix.setWith(this.__world).scaleWith(1 / scale).invertWith().translate(-x * scale, -y * scale) }, !data.__hitPixelFill, !data.__hitPixelStroke) // 矩阵
        ImageManager.patternLocked = false
        h.resetTransform()
    }

    this.__drawHitPath(h)
    h.setStrokeOptions(data)
}

UI.prototype.__hit = function (inner: IRadiusPointData): boolean {
    if (Platform.name === 'miniapp') this.__drawHitPath(this.__hitCanvas) // fix: 小程序需要实时更新

    // hit pixel

    const data = this.__
    if (data.__hitPixelFill || data.__hitPixelStroke) {
        if (this.__hitPixel(inner)) return true
    }

    // hit path

    const { hitFill } = data
    const needHitFillPath = ((data.fill && hitFill == 'path') || hitFill === 'all')
    if (needHitFillPath && this.__hitFill(inner)) return true

    const { hitStroke, __strokeWidth } = data
    const needHitStrokePath = ((data.stroke && hitStroke == 'path') || hitStroke === 'all')
    if (!needHitFillPath && !needHitStrokePath) return false

    const radiusWidth = inner.radiusX * 2
    let hitWidth = radiusWidth

    if (needHitStrokePath) {
        switch (data.strokeAlign) {
            case 'inside':
                hitWidth += __strokeWidth * 2
                if (!needHitFillPath && this.__hitFill(inner) && this.__hitStroke(inner, hitWidth)) return true
                hitWidth = radiusWidth
                break
            case 'center':
                hitWidth += __strokeWidth
                break
            case 'outside':
                hitWidth += __strokeWidth * 2
                if (!needHitFillPath) {
                    if (!this.__hitFill(inner) && this.__hitStroke(inner, hitWidth)) return true
                    hitWidth = radiusWidth
                }
                break
        }
    }

    return hitWidth ? this.__hitStroke(inner, hitWidth) : false
}