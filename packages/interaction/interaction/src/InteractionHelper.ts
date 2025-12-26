import { IPointerEvent, IDragEvent, ISwipeEvent, IUIEvent, IPointData, ILeafList, IDropEvent, IObject } from '@leafer/interface'
import { PointHelper, LeafList, isUndefined, LeafHelper } from '@leafer/core'

import { SwipeEvent, DragEvent } from '@leafer-ui/event'


export const InteractionHelper = {

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
        if (angle < -45 && angle > -135) return SwipeEvent.UP
        else if (angle > 45 && angle < 135) return SwipeEvent.DOWN
        else if (angle <= 45 && angle >= -45) return SwipeEvent.RIGHT
        else return SwipeEvent.LEFT
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
            time: Date.now(),
            buttons: isUndefined(e.buttons) ? 1 : (e.buttons === 0 ? pointerUpButtons : e.buttons), // touchEvent no button and buttons, set default
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
        return path && path.list.some(item => LeafHelper.draggable(item) || (!item.isLeafer && item.hasEvent(DragEvent.DRAG)))
    },

    pathHasOutside(path: ILeafList): boolean { // 滚动条元素
        return path && path.list.some(item => item.isOutside)
    },
}

const I = InteractionHelper