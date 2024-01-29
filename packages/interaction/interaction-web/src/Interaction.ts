import { IObject, IPointData, ITimer, IKeepTouchData, ICursorType } from '@leafer/interface'
import { MathHelper } from '@leafer/core'
import { InteractionBase, InteractionHelper, Cursor } from '@leafer/interaction'

import { PointerEventHelper } from './PointerEventHelper'
import { WheelEventHelper } from './WheelEventHelper'
import { KeyEventHelper } from './KeyEventHelper'


interface IClientPoint {
    clientX: number
    clientY: number
}

interface IGestureEvent extends IClientPoint, UIEvent {
    scale: number
    rotation: number
    preventDefault(): void
}


const { getMoveEventData, getZoomEventData, getRotateEventData } = InteractionHelper

export class Interaction extends InteractionBase {

    protected view: HTMLElement

    protected viewEvents: IObject
    protected windowEvents: IObject

    protected usePointer: boolean
    protected useMultiTouch: boolean
    protected useTouch: boolean

    protected touchTimer: ITimer
    protected touches?: Touch[]
    protected lastGestureScale: number
    protected lastGestureRotation: number

    protected __listenEvents(): void {
        super.__listenEvents()

        const view = this.view = this.canvas.view as HTMLCanvasElement

        // PointerEvent > TouchEvent > MouseEvent
        this.viewEvents = {
            'pointerdown': this.onPointerDown,
            'mousedown': this.onMouseDown,
            'touchstart': this.onTouchStart,

            'contextmenu': this.onContextMenu,

            'wheel': this.onWheel,
            'gesturestart': this.onGesturestart,
            'gesturechange': this.onGesturechange,
            'gestureend': this.onGestureend
        }

        this.windowEvents = {
            'pointermove': this.onPointerMove,
            'pointerup': this.onPointerUp,
            'pointercancel': this.onPointerCancel,

            'mousemove': this.onMouseMove,
            'mouseup': this.onMouseUp,

            // touch / multitouch
            'touchmove': this.onTouchMove,
            'touchend': this.onTouchEnd,
            'touchcancel': this.onTouchCancel,

            'keydown': this.onKeyDown,
            'keyup': this.onKeyUp,

            'scroll': this.onScroll
        }

        const { viewEvents, windowEvents } = this

        for (let name in viewEvents) {
            viewEvents[name] = viewEvents[name].bind(this)
            view.addEventListener(name, viewEvents[name])
        }

        for (let name in windowEvents) {
            windowEvents[name] = windowEvents[name].bind(this)
            window.addEventListener(name, windowEvents[name])
        }
    }

    protected __removeListenEvents(): void {
        super.__removeListenEvents()

        const { viewEvents, windowEvents } = this

        for (let name in viewEvents) {
            this.view.removeEventListener(name, viewEvents[name])
            this.viewEvents = {}
        }

        for (let name in windowEvents) {
            window.removeEventListener(name, windowEvents[name])
            this.windowEvents = {}
        }
    }

    protected getLocal(p: IClientPoint, updateClient?: boolean): IPointData {
        if (updateClient) this.canvas.updateClientBounds()
        const { clientBounds } = this.canvas
        return { x: p.clientX - clientBounds.x, y: p.clientY - clientBounds.y }
    }

    protected getTouches(touches: TouchList): Touch[] {
        const list: Touch[] = []
        for (let i = 0, len = touches.length; i < len; i++) {
            list.push(touches[i])
        }
        return list
    }


    protected preventDefaultPointer(e: UIEvent): void {
        const { pointer } = this.config
        if (pointer.preventDefault) e.preventDefault()
    }

    protected preventDefaultWheel(e: UIEvent): void {
        const { wheel } = this.config
        if (wheel.preventDefault) e.preventDefault()
    }

    protected preventWindowPointer(e: UIEvent) {
        return !this.downData && e.target !== this.view
    }

    // key
    protected onKeyDown(e: KeyboardEvent): void {
        this.keyDown(KeyEventHelper.convert(e))
    }

    protected onKeyUp(e: KeyboardEvent): void {
        this.keyUp(KeyEventHelper.convert(e))
    }

    // context menu

    protected onContextMenu(e: PointerEvent): void {
        if (this.config.pointer.preventDefaultMenu) e.preventDefault()
        this.menu(PointerEventHelper.convert(e, this.getLocal(e)))
    }

    protected onScroll(): void {
        this.canvas.updateClientBounds()
    }

    // pointer
    protected onPointerDown(e: PointerEvent): void {
        this.preventDefaultPointer(e)

        this.usePointer || (this.usePointer = true)
        if (this.useMultiTouch) return
        this.pointerDown(PointerEventHelper.convert(e, this.getLocal(e)))
    }

    protected onPointerMove(e: PointerEvent): void {
        this.usePointer || (this.usePointer = true)
        if (this.useMultiTouch || this.preventWindowPointer(e)) return
        this.pointerMove(PointerEventHelper.convert(e, this.getLocal(e, true)))
    }

    protected onPointerUp(e: PointerEvent): void {
        if (this.downData) this.preventDefaultPointer(e)
        if (this.useMultiTouch || this.preventWindowPointer(e)) return
        this.pointerUp(PointerEventHelper.convert(e, this.getLocal(e)))
    }

    protected onPointerCancel(): void {
        if (this.useMultiTouch) return
        this.pointerCancel()
    }


    // mouse
    protected onMouseDown(e: MouseEvent): void {
        this.preventDefaultPointer(e)

        if (this.useTouch || this.usePointer) return
        this.pointerDown(PointerEventHelper.convertMouse(e, this.getLocal(e)))
    }

    protected onMouseMove(e: MouseEvent): void {
        if (this.useTouch || this.usePointer || this.preventWindowPointer(e)) return
        this.pointerMove(PointerEventHelper.convertMouse(e, this.getLocal(e, true)))
    }

    protected onMouseUp(e: MouseEvent): void {
        if (this.downData) this.preventDefaultPointer(e)
        if (this.useTouch || this.usePointer || this.preventWindowPointer(e)) return
        this.pointerUp(PointerEventHelper.convertMouse(e, this.getLocal(e)))
    }

    protected onMouseCancel(): void {
        if (this.useTouch || this.usePointer) return
        this.pointerCancel()
    }


    // touch
    protected onTouchStart(e: TouchEvent): void {
        e.preventDefault()

        this.multiTouchStart(e)

        if (this.usePointer) return
        if (this.touchTimer) {
            window.clearTimeout(this.touchTimer)
            this.touchTimer = 0
        }
        this.useTouch = true
        const touch = PointerEventHelper.getTouch(e)
        this.pointerDown(PointerEventHelper.convertTouch(e, this.getLocal(touch, true)))
    }

    protected onTouchMove(e: TouchEvent): void {
        this.multiTouchMove(e)

        if (this.usePointer || this.preventWindowPointer(e)) return
        const touch = PointerEventHelper.getTouch(e)
        this.pointerMove(PointerEventHelper.convertTouch(e, this.getLocal(touch)))
    }

    protected onTouchEnd(e: TouchEvent): void {
        this.multiTouchEnd()

        if (this.usePointer || this.preventWindowPointer(e)) return
        if (this.touchTimer) clearTimeout(this.touchTimer)
        this.touchTimer = setTimeout(() => {
            this.useTouch = false
        }, 500) // stop touch > mouse
        const touch = PointerEventHelper.getTouch(e)
        this.pointerUp(PointerEventHelper.convertTouch(e, this.getLocal(touch)))
    }

    protected onTouchCancel(): void {
        if (this.usePointer) return
        this.pointerCancel()
    }


    // multiTouch
    protected multiTouchStart(e: TouchEvent): void {
        this.useMultiTouch = (e.touches.length >= 2)
        this.touches = this.useMultiTouch ? this.getTouches(e.touches) : undefined
        if (this.useMultiTouch) this.pointerCancel()
    }

    protected multiTouchMove(e: TouchEvent): void {
        if (!this.useMultiTouch) return
        if (e.touches.length > 1) {
            const touches = this.getTouches(e.touches)
            const list = this.getKeepTouchList(this.touches, touches)
            if (list.length > 1) {
                this.multiTouch(InteractionHelper.getBase(e), list)
                this.touches = touches
            }
        }
    }

    protected multiTouchEnd(): void {
        this.touches = null
        this.useMultiTouch = false
        this.transformEnd()
    }

    protected getKeepTouchList(old: Touch[], touches: Touch[]): IKeepTouchData[] {
        let to: Touch
        const list: IKeepTouchData[] = []
        old.forEach(from => {
            to = touches.find(touch => touch.identifier === from.identifier)
            if (to) list.push({ from: this.getLocal(from), to: this.getLocal(to) })
        })
        return list
    }

    protected getLocalTouchs(points: Touch[]): IPointData[] {
        return points.map(point => this.getLocal(point))
    }


    // wheel
    protected onWheel(e: WheelEvent): void {
        this.preventDefaultWheel(e)

        const { wheel } = this.config
        const scale = wheel.getScale ? wheel.getScale(e, wheel) : WheelEventHelper.getScale(e, wheel)
        const local = this.getLocal(e)

        const eventBase = InteractionHelper.getBase(e)
        scale !== 1 ? this.zoom(getZoomEventData(local, scale, eventBase)) : this.move(getMoveEventData(local, wheel.getMove ? wheel.getMove(e, wheel) : WheelEventHelper.getMove(e, wheel), eventBase))
    }


    // safari 
    protected onGesturestart(e: IGestureEvent): void {
        this.preventDefaultWheel(e)

        this.lastGestureScale = 1
        this.lastGestureRotation = 0
    }

    protected onGesturechange(e: IGestureEvent): void {
        this.preventDefaultWheel(e)

        const local = this.getLocal(e)
        const eventBase = InteractionHelper.getBase(e)
        const changeScale = e.scale / this.lastGestureScale
        const changeAngle = e.rotation - this.lastGestureRotation

        let { rotateSpeed } = this.config.wheel
        rotateSpeed = MathHelper.within(rotateSpeed, 0, 1)

        this.zoom(getZoomEventData(local, changeScale * changeScale, eventBase))
        this.rotate(getRotateEventData(local, changeAngle / Math.PI * 180 * (rotateSpeed / 4 + 0.1), eventBase))

        this.lastGestureScale = e.scale
        this.lastGestureRotation = e.rotation
    }

    protected onGestureend(e: IGestureEvent): void {
        this.preventDefaultWheel(e)

        this.transformEnd()
    }


    // cursor
    public setCursor(cursor: ICursorType | ICursorType[]): void {
        super.setCursor(cursor)
        const list: ICursorType[] = []
        this.eachCursor(cursor, list)
        if (typeof list[list.length - 1] === 'object') list.push('default')
        this.canvas.view.style.cursor = list.map(item => (typeof item === 'object') ? `url(${item.url}) ${item.x || 0} ${item.y || 0}` : item).join(',')
    }

    protected eachCursor(cursor: ICursorType | ICursorType[], list: ICursorType[], level = 0): void {
        level++
        if (cursor instanceof Array) {
            cursor.forEach(item => this.eachCursor(item, list, level))
        } else {
            const custom = typeof cursor === 'string' && Cursor.get(cursor)
            if (custom && level < 2) {
                this.eachCursor(custom, list, level)
            } else {
                list.push(cursor)
            }
        }
    }

    public destroy(): void {
        if (this.view) {
            super.destroy()
            this.view = null
            this.touches = null
        }
    }

}