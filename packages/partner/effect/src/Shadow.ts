import { IBoundsData, IFourNumber, ILeaferCanvas, IMatrixData, IOffsetBoundsData } from '@leafer/interface'
import { BoundsHelper, LeafHelper, Matrix, Platform } from '@leafer/core'

import { IUI, ICachedShape, ILeafShadowEffect } from '@leafer-ui/interface'
import { ColorConvert, Effect } from '@leafer-ui/draw'


const { copy, move, toOffsetOutBounds } = BoundsHelper, { max, abs } = Math
const tempBounds = {} as IBoundsData, tempMatrix = new Matrix()
const offsetOutBounds = {} as IOffsetBoundsData

export function shadow(ui: IUI, current: ILeaferCanvas, shape: ICachedShape): void {

    let copyBounds: IBoundsData, transform: IMatrixData

    const { __nowWorld: nowWorld } = ui
    const { shadow } = ui.__
    const { worldCanvas, bounds, renderBounds, shapeBounds, scaleX, scaleY } = shape

    const other = current.getSameCanvas()
    const end = shadow.length - 1

    toOffsetOutBounds(bounds, offsetOutBounds, renderBounds)

    shadow.forEach((item, index) => {

        let otherScale = 1 // 关联 scaleFixed 逻辑

        if (item.scaleFixed) {
            const sx = Math.abs(nowWorld.scaleX)
            if (sx > 1) otherScale = 1 / sx
        }

        other.setWorldShadow((offsetOutBounds.offsetX + (item.x || 0) * scaleX * otherScale), (offsetOutBounds.offsetY + (item.y || 0) * scaleY * otherScale), (item.blur || 0) * scaleX * otherScale, ColorConvert.string(item.color))

        transform = Effect.getShadowTransform(ui, other, shape, item, offsetOutBounds, otherScale)
        if (transform) other.setTransform(transform)

        drawWorldShadow(other, offsetOutBounds, shape)

        if (transform) other.resetTransform()

        copyBounds = renderBounds

        if (item.box) {

            other.restore() // remove shadow style
            other.save()

            if (worldCanvas) {
                other.copyWorld(other, renderBounds, nowWorld, 'copy')
                copyBounds = nowWorld
            }

            worldCanvas ? other.copyWorld(worldCanvas, nowWorld, nowWorld, 'destination-out') : other.copyWorld(shape.canvas, shapeBounds, bounds, 'destination-out')
        }

        LeafHelper.copyCanvasByWorld(ui, current, other, copyBounds, item.blendMode)

        if (end && index < end) other.clearWorld(copyBounds)
    })

    other.recycle(copyBounds)

}

export function getShadowRenderSpread(_ui: IUI, shadow: ILeafShadowEffect[]): IFourNumber {
    let top = 0, right = 0, bottom = 0, left = 0, x: number, y: number, spread: number, blur: number
    shadow.forEach(item => {
        x = item.x || 0, y = item.y || 0, blur = (item.blur || 0) * 1.5, spread = abs(item.spread || 0) // must abs spread

        top = max(top, spread + blur - y)
        right = max(right, spread + blur + x)
        bottom = max(bottom, spread + blur + y)
        left = max(left, spread + blur - x)
    })
    return (top === right && right === bottom && bottom === left) ? top : [top, right, bottom, left]
}

export function getShadowTransform(ui: IUI, canvas: ILeaferCanvas, _shape: ICachedShape, shadow: ILeafShadowEffect, outBounds: IBoundsData, otherScale: number, isInnerShaodw?: boolean): IMatrixData {
    if (shadow.spread) {
        const spread = shadow.spread * 2 * otherScale * (isInnerShaodw ? -1 : 1), { width, height } = ui.__layout.strokeBounds
        tempMatrix.set().scaleOfOuter({ x: (outBounds.x + outBounds.width / 2) * canvas.pixelRatio, y: (outBounds.y + outBounds.height / 2) * canvas.pixelRatio }, 1 + spread / width, 1 + spread / height)
        return tempMatrix
    }
    return undefined
}

export function drawWorldShadow(canvas: ILeaferCanvas, outBounds: IBoundsData, shape: ICachedShape): void {
    const { shapeBounds } = shape
    let from: IBoundsData, to: IBoundsData

    if (Platform.fullImageShadow) { // Safari
        copy(tempBounds, canvas.bounds)
        move(tempBounds, outBounds.x - shapeBounds.x, outBounds.y - shapeBounds.y)
        from = canvas.bounds, to = tempBounds
    } else {
        from = shapeBounds, to = outBounds
    }

    canvas.copyWorld(shape.canvas, from, to)
}