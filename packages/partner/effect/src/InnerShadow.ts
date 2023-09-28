import { IBoundsData, ILeaferCanvas, IMatrixWithBoundsData, IOffsetBoundsData, IRenderOptions } from '@leafer/interface'
import { BoundsHelper } from '@leafer/core'

import { IUI, ICachedShape } from '@leafer-ui/interface'

import { drawWorldShadow } from './Shadow'


const { toOffsetOutBounds } = BoundsHelper
const offsetOutBounds = {} as IOffsetBoundsData

export function innerShadow(ui: IUI, current: ILeaferCanvas, shape: ICachedShape, renderOptions: IRenderOptions): void {

    let copyBounds: IBoundsData, spreadScale: number

    const { __world, __layout: __layout } = ui
    const { innerShadow } = ui.__
    const { worldCanvas, bounds, shapeBounds, scaleX, scaleY } = shape

    const other = current.getSameCanvas()
    const end = innerShadow.length - 1

    toOffsetOutBounds(bounds, offsetOutBounds)

    innerShadow.forEach((item, index) => {

        other.save()

        other.setWorldShadow((offsetOutBounds.offsetX + item.x * scaleX), (offsetOutBounds.offsetY + item.y * scaleY), item.blur * scaleX)

        spreadScale = item.spread ? 1 - item.spread * 2 / (__layout.boxBounds.width + (__layout.strokeBoxSpread || 0) * 2) : 0

        drawWorldShadow(other, offsetOutBounds, spreadScale, shape)

        other.restore()

        if (worldCanvas) {
            other.copyWorld(other, bounds, __world, 'copy')
            other.copyWorld(worldCanvas, __world, __world, 'source-out')
            copyBounds = __world
        } else {
            other.copyWorld(shape.canvas, shapeBounds, bounds, 'source-out')
            copyBounds = bounds
        }

        other.fillWorld(copyBounds, item.color, 'source-in')

        if (ui.__hasMirror || renderOptions.matrix) {
            current.copyWorldByReset(other, copyBounds, __world, item.blendMode)
        } else {
            current.copyWorldToInner(other, copyBounds as IMatrixWithBoundsData, __layout.renderBounds, item.blendMode)
        }

        if (end && index < end) other.clear()

    })

    other.recycle()

}


