import { IEvent, IPointerEvent, IMoveEvent, IZoomEvent, IRotateEvent, IDragEvent, ISwipeEvent, IUIEvent, IPointData, ILeafList, IDropEvent, IObject } from '@leafer/interface'
import { PointHelper, LeafList } from '@leafer/core'

import { SwipeEvent, DragEvent } from '@leafer-ui/event'


export const InteractionHelper = {

    getMoveEventData(center: IPointData, move: IPointData, event: IEvent): IMoveEvent {
        return {
            ...event,
            x: center.x,
            y: center.y,
            moveX: move.x,
            moveY: move.y
        } as IMoveEvent
    },

    getRotateEventData(center: IPointData, angle: number, event: IEvent): IRotateEvent {
        return {
            ...event,
            x: center.x,
            y: center.y,
            rotation: angle
        } as IRotateEvent
    },

    getZoomEventData(center: IPointData, scale: number, event: IEvent): IZoomEvent {
        return {
            ...event,
            x: center.x,
            y: center.y,
            scale,
        } as IZoomEvent
    },

    getDragEventData(startPoint: IPointData, lastPoint: IPointData, event: IPointerEvent): IDragEvent {
        return {
            ...event,
            x: event.x,
            y: event.y,
            moveX: event.x - lastPoint.x,
            moveY: event.y - lastPoint.y,
            totalX: event.x - startPoint.x,
            totalY: event.y - startPoint.y,
        } as IDragEvent
    },

    getDropEventData(event: IPointerEvent, list: ILeafList, data: IObject): IDropEvent {
        return {
            ...event,
            list,
            data
        }
    },

    getSwipeDirection(angle: number): string {
        if (angle < -45 && angle > -135) {
            return SwipeEvent.UP
        } else if (angle > 45 && angle < 135) {
            return SwipeEvent.DOWN
        } else if (angle <= 45 && angle >= -45) {
            return SwipeEvent.RIGHT
        } else {
            return SwipeEvent.LEFT
        }
    },

    getSwipeEventData(startPoint: IPointData, lastDragData: IDragEvent, event: IPointerEvent): ISwipeEvent {
        return {
            ...event,
            moveX: lastDragData.moveX,
            moveY: lastDragData.moveY,
            totalX: event.x - startPoint.x,
            totalY: event.y - startPoint.y,
            type: I.getSwipeDirection(PointHelper.getAngle(startPoint, event)),
        }
    },


    getBase(e: IObject): IUIEvent {
        const pointerUpButtons = e.button === 1 ? 4 : e.button // 0: left, 1: middle, 2: right
        return {
            altKey: e.altKey,
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey,
            metaKey: e.metaKey,
            buttons: e.buttons === undefined ? 1 : (e.buttons === 0 ? pointerUpButtons : e.buttons), // touchEvent no button and buttons, set default
            origin: e
        } as IUIEvent
    },

    pathHasEventType(path: ILeafList, type: string): boolean {
        const { list } = path
        for (let i = 0, len = list.length; i < len; i++) {
            if (list[i].hasEvent(type)) return true
        }
        return false
    },

    filterPathByEventType(path: ILeafList, type: string): ILeafList {
        const find = new LeafList()
        const { list } = path
        for (let i = 0, len = list.length; i < len; i++) {
            if (list[i].hasEvent(type)) find.add(list[i])
        }
        return find
    },

    pathCanDrag(path: ILeafList): boolean {
        return path && path.list.some(item => item.draggable || item.editable || (!item.isLeafer && item.hasEvent(DragEvent.DRAG)))
    },

    pathHasOutside(path: ILeafList): boolean { // 滚动条元素
        return path && path.list.some(item => item.isOutside)
    },
}

const I = InteractionHelper