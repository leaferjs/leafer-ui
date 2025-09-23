import { IBoundsData, IMatrixData, ILeaferCanvas, IOffsetBoundsData } from '@leafer/interface'
import { BoundsHelper, LeafHelper } from '@leafer/core'

import { IUI, ICachedShape } from '@leafer-ui/interface'
import { ColorConvert, Effect } from '@leafer-ui/draw'

import { drawWorldShadow, getShadowRenderSpread } from './Shadow'


const { toOffsetOutBounds } = BoundsHelper
const offsetOutBounds = {} as IOffsetBoundsData

export function innerShadow(ui: IUI, current: ILeaferCanvas, shape: ICachedShape): void {

    let copyBounds: IBoundsData, transform: IMatrixData

    const { __nowWorld: nowWorld } = ui
    const { innerShadow } = ui.__
    const { worldCanvas, bounds, renderBounds, shapeBounds, scaleX, scaleY } = shape

    const other = current.getSameCanvas()
    const end = innerShadow.length - 1

    toOffsetOutBounds(bounds, offsetOutBounds, renderBounds)

    innerShadow.forEach((item, index) => {

        let otherScale = 1 // 关联 scaleFixed 逻辑

        if (item.scaleFixed) {
            const sx = Math.abs(nowWorld.scaleX)
            if (sx > 1) otherScale = 1 / sx
        }

        other.save()

        other.setWorldShadow((offsetOutBounds.offsetX + (item.x || 0) * scaleX * otherScale), (offsetOutBounds.offsetY + (item.y || 0) * scaleY * otherScale), (item.blur || 0) * scaleX * otherScale)

        transform = Effect.getShadowTransform(ui, other, shape, item, offsetOutBounds, otherScale, true)
        if (transform) other.setTransform(transform)

        drawWorldShadow(other, offsetOutBounds, shape)

        other.restore()

        if (worldCanvas) {
            other.copyWorld(other, renderBounds, nowWorld, 'copy')
            other.copyWorld(worldCanvas, nowWorld, nowWorld, 'source-out')
            copyBounds = nowWorld
        } else {
            other.copyWorld(shape.canvas, shapeBounds, bounds, 'source-out')
            copyBounds = renderBounds
        }

        other.fillWorld(copyBounds, ColorConvert.string(item.color), 'source-in')

        LeafHelper.copyCanvasByWorld(ui, current, other, copyBounds, item.blendMode)

        if (end && index < end) other.clearWorld(copyBounds)

    })

    other.recycle(copyBounds)

}

export const getInnerShadowSpread = getShadowRenderSpread