import { IBoundsData, ILeaferCanvas, IOffsetBoundsData } from '@leafer/interface'
import { BoundsHelper, LeafHelper, Platform } from '@leafer/core'

import { IUI, ICachedShape } from '@leafer-ui/interface'
import { ColorConvert } from '@leafer-ui/draw'


const { copy, toOffsetOutBounds } = BoundsHelper
const tempBounds = {} as IBoundsData
const offsetOutBounds = {} as IOffsetBoundsData

export function shadow(ui: IUI, current: ILeaferCanvas, shape: ICachedShape): void {

    let copyBounds: IBoundsData, spreadScale: number

    const { __nowWorld: nowWorld, __layout } = ui
    const { shadow } = ui.__
    const { worldCanvas, bounds, shapeBounds, scaleX, scaleY } = shape

    const other = current.getSameCanvas()
    const end = shadow.length - 1

    toOffsetOutBounds(bounds, offsetOutBounds)

    shadow.forEach((item, index) => {

        other.setWorldShadow((offsetOutBounds.offsetX + item.x * scaleX), (offsetOutBounds.offsetY + item.y * scaleY), item.blur * scaleX, ColorConvert.string(item.color))

        spreadScale = item.spread ? 1 + item.spread * 2 / (__layout.boxBounds.width + (__layout.strokeBoxSpread || 0) * 2) : 0

        drawWorldShadow(other, offsetOutBounds, spreadScale, shape)

        copyBounds = bounds

        if (item.box) {

            other.restore() // remove shadow style
            other.save()

            if (worldCanvas) {
                other.copyWorld(other, bounds, nowWorld, 'copy')
                copyBounds = nowWorld
            }

            worldCanvas ? other.copyWorld(worldCanvas, nowWorld, nowWorld, 'destination-out') : other.copyWorld(shape.canvas, shapeBounds, bounds, 'destination-out')
        }

        LeafHelper.copyCanvasByWorld(ui, current, other, copyBounds, item.blendMode)

        if (end && index < end) other.clearWorld(copyBounds, true)
    })

    other.recycle(copyBounds)

}


export function drawWorldShadow(canvas: ILeaferCanvas, outBounds: IBoundsData, spreadScale: number, shape: ICachedShape,): void {

    const { bounds, shapeBounds } = shape

    if (Platform.fullImageShadow || spreadScale) { // Safari, fix: 存在spreadScale时导出的问题

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