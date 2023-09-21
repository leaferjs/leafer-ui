import { ILeafer } from '@leafer/interface'

import { MoveEvent, ZoomEvent, LeafHelper } from '@leafer/core'


export function design(leafer: ILeafer): void {
    if (leafer.isApp) return
    leafer.__eventIds.push(
        leafer.on_(MoveEvent.BEFORE_MOVE, (e: MoveEvent) => { LeafHelper.moveWorld(leafer.moveLayer, e.moveX, e.moveY) }),
        leafer.on_(ZoomEvent.BEFORE_ZOOM, (e: ZoomEvent) => {
            const { scaleX } = leafer.zoomLayer.__, { min, max } = leafer.config.zoom
            let { scale } = e
            if (scale * Math.abs(scaleX) < min) scale = min / scaleX
            else if (scale * Math.abs(scaleX) > max) scale = max / scaleX
            if (scale !== 1) LeafHelper.zoomOfWorld(leafer.zoomLayer, e, scale)
        })
    )
}