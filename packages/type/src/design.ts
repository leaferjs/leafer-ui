import { ILeaferBase } from '@leafer/interface'

import { PointHelper } from '@leafer/core'

import { MoveEvent, ZoomEvent } from '@leafer-ui/event'
import { Group } from '@leafer-ui/display'


export function design(leafer: ILeaferBase): void {
    if (leafer.isApp) return
    leafer.__eventIds.push(
        leafer.on_(MoveEvent.BEFORE_MOVE, (e: MoveEvent) => leafer.zoomLayer.move(e.moveX, e.moveY)),
        leafer.on_(ZoomEvent.BEFORE_ZOOM, (e: ZoomEvent) => {
            const { zoomLayer } = leafer
            const { scaleX } = zoomLayer.__, { min, max } = leafer.app.config.zoom

            let { scale } = e, absScale = Math.abs(scaleX * scale)

            if (absScale < min) scale = min / scaleX
            else if (absScale > max) scale = max / scaleX

            if (scale !== 1) {
                PointHelper.scaleOf(zoomLayer as Group, e, scale)
                zoomLayer.scale = scaleX * scale
            }
        })
    )
}