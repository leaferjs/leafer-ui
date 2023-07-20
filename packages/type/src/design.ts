import { ILeafer } from '@leafer/interface'

import { MoveEvent, ZoomEvent, LeafHelper } from '@leafer/core'


export function design(leafer: ILeafer): void {
    const { MOVE } = MoveEvent
    const { ZOOM } = ZoomEvent
    leafer.__eventIds.push(
        leafer.on_(MOVE, (e: MoveEvent) => { LeafHelper.moveWorld(leafer.moveLayer, e.moveX, e.moveY) }),
        leafer.on_(ZOOM, (e: ZoomEvent) => {
            const { scaleX } = leafer.zoomLayer.__, { min, max } = leafer.config.zoom
            let { scale } = e
            if (scale * scaleX < min) scale = min / scaleX
            else if (scale * scaleX > max) scale = max / scaleX
            if (scale !== 1) LeafHelper.zoomOfWorld(leafer.zoomLayer, e, scale)
        })
    )
}