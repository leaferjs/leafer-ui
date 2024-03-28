import { ILeaferBase, IPointData } from '@leafer/interface'

import { PointHelper } from '@leafer/core'

import { MoveEvent, ZoomEvent } from '@leafer-ui/event'


export function addInteractionWindow(leafer: ILeaferBase): void {
    if (leafer.isApp) return
    leafer.__eventIds.push(
        leafer.on_(MoveEvent.BEFORE_MOVE, (e: MoveEvent) => {
            const { x, y } = leafer.getValidMove(e.moveX, e.moveY)
            if (x || y) leafer.zoomLayer.move(x, y)
        }),
        leafer.on_(ZoomEvent.BEFORE_ZOOM, (e: ZoomEvent) => {
            const { zoomLayer } = leafer
            const changeScale = leafer.getValidScale(e.scale)
            if (changeScale !== 1) {
                PointHelper.scaleOf(zoomLayer as IPointData, e, changeScale)
                zoomLayer.scale = zoomLayer.__.scaleX * changeScale
            }
        })
    )
}