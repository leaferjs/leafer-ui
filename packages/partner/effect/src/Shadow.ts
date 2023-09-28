import { IBoundsData, ILeaferCanvas, IMatrixWithBoundsData, IOffsetBoundsData, IRenderOptions } from '@leafer/interface'
import { BoundsHelper, Platform } from '@leafer/core'

import { IUI, ICachedShape } from '@leafer-ui/interface'


const { copy, toOffsetOutBounds } = BoundsHelper
const tempBounds = {} as IBoundsData
const offsetOutBounds = {} as IOffsetBoundsData

export function shadow(ui: IUI, current: ILeaferCanvas, shape: ICachedShape, renderOptions: IRenderOptions): void {

    let copyBounds: IBoundsData, spreadScale: number

    const { __world, __layout } = ui
    const { shadow } = ui.__
    const { worldCanvas, bounds, shapeBounds, scaleX, scaleY } = shape

    const other = current.getSameCanvas()
    const end = shadow.length - 1

    toOffsetOutBounds(bounds, offsetOutBounds)

    shadow.forEach((item, index) => {

        other.setWorldShadow((offsetOutBounds.offsetX + item.x * scaleX), (offsetOutBounds.offsetY + item.y * scaleY), item.blur * scaleX, item.color)

        spreadScale = item.spread ? 1 + item.spread * 2 / (__layout.boxBounds.width + (__layout.strokeBoxSpread || 0) * 2) : 0

        drawWorldShadow(other, offsetOutBounds, spreadScale, shape)

        copyBounds = bounds

        if (item.box) {

            other.restore()
            other.save()

            if (worldCanvas) {
                other.copyWorld(other, bounds, __world, 'copy')
                copyBounds = __world
            }

            worldCanvas ? other.copyWorld(worldCanvas, __world, __world, 'destination-out') : other.copyWorld(shape.canvas, shapeBounds, bounds, 'destination-out')
        }

        if (ui.__hasMirror || renderOptions.matrix) {
            current.copyWorldByReset(other, copyBounds, __world, item.blendMode)
        } else {
            current.copyWorldToInner(other, copyBounds as IMatrixWithBoundsData, __layout.renderBounds, item.blendMode)
        }

        if (end && index < end) other.clear()
    })

    other.recycle()

}


export function drawWorldShadow(canvas: ILeaferCanvas, outBounds: IBoundsData, spreadScale: number, shape: ICachedShape,): void {

    const { bounds, shapeBounds } = shape

    if (Platform.fullImageShadow) { // Safari

        copy(tempBounds, canvas.bounds)
        tempBounds.x += (outBounds.x - shapeBounds.x)
        tempBounds.y += (outBounds.y - shapeBounds.y)

        if (spreadScale) {
            const { matrix } = shape
            tempBounds.x -= (bounds.x + (matrix ? matrix.e : 0) + bounds.width / 2) * (spreadScale - 1)
            tempBounds.y -= (bounds.y + (matrix ? matrix.f : 0) + bounds.height / 2) * (spreadScale - 1)
            tempBounds.width *= spreadScale
            tempBounds.height *= spreadScale
        }

        canvas.copyWorld(shape.canvas, canvas.bounds, tempBounds)

    } else {

        if (spreadScale) {
            copy(tempBounds, outBounds)
            tempBounds.x -= (outBounds.width / 2) * (spreadScale - 1)
            tempBounds.y -= (outBounds.height / 2) * (spreadScale - 1)
            tempBounds.width *= spreadScale
            tempBounds.height *= spreadScale
        }

        canvas.copyWorld(shape.canvas, shapeBounds, spreadScale ? tempBounds : outBounds)
    }

}