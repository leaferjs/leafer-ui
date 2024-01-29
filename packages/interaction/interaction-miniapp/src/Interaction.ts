import { IKeepTouchData, IPointData } from '@leafer/interface'
import { InteractionBase, InteractionHelper } from '@leafer/interaction'

import { PointerEventHelper } from './PointerEventHelper'


interface IClientPoint {
    clientX: number
    clientY: number
    x?: number
    y?: number
}

interface ITouch {
    readonly clientX: number
    readonly clientY: number
    readonly identifier: number
    readonly pageX: number
    readonly pageY: number
    readonly x?: number
    readonly y?: number
}


export class Interaction extends InteractionBase {

    protected useMultiTouch: boolean
    protected useTouch: boolean
    protected touches?: ITouch[]

    protected __listenEvents(): void {
        super.__listenEvents()
        if (this.config.eventer) this.config.eventer.receiveEvent = this.receive.bind(this)

    }

    public receive(e: any): void {
        switch (e.type) {
            case 'touchstart':
                this.onTouchStart(e)
                break
            case 'touchmove':
                this.onTouchMove(e)
                break
            case 'touchend':
                this.onTouchEnd(e)
                break
            case 'touchcancel':
                this.onTouchCancel()
        }
    }

    protected getLocal(p: IClientPoint, updateClient?: boolean): IPointData {
        if (updateClient) this.canvas.updateClientBounds()
        if (p.x !== undefined) {
            return { x: p.x, y: p.y } // Canvas
        } else {
            const { clientBounds } = this.canvas
            return { x: p.clientX - clientBounds.x, y: p.clientY - clientBounds.y }
        }
    }

    protected getTouches(touches: any): ITouch[] {
        return touches
    }


    // touch
    protected onTouchStart(e: TouchEvent): void {
        this.multiTouchStart(e)

        const touch = PointerEventHelper.getTouch(e)
        this.pointerDown(PointerEventHelper.convertTouch(e, this.getLocal(touch, true)))
    }

    protected onTouchMove(e: TouchEvent): void {
        this.multiTouchMove(e)
        if (this.useMultiTouch) return
        const touch = PointerEventHelper.getTouch(e)
        this.pointerMove(PointerEventHelper.convertTouch(e, this.getLocal(touch)))
    }

    protected onTouchEnd(e: TouchEvent): void {
        this.multiTouchEnd()

        const touch = PointerEventHelper.getTouch(e)
        this.pointerUp(PointerEventHelper.convertTouch(e, this.getLocal(touch)))
    }

    protected onTouchCancel(): void {
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

    protected getKeepTouchList(old: ITouch[], touches: ITouch[]): IKeepTouchData[] {
        let to: ITouch
        const list: IKeepTouchData[] = []
        old.forEach(from => {
            to = touches.find(touch => touch.identifier === from.identifier)
            if (to) list.push({ from: this.getLocal(from), to: this.getLocal(to) })
        })
        return list
    }

    protected getLocalTouchs(points: ITouch[]): IPointData[] {
        return points.map(point => this.getLocal(point))
    }


    public destroy(): void {
        super.destroy()
        this.touches = null
    }

}