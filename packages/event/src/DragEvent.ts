import { IDragEvent, IPointData, ILeaf, ILeafList, IObject, IBoundsData } from '@leafer/interface'
import { registerUIEvent, LeafList, BoundsHelper } from '@leafer/core'

import { PointerEvent } from './PointerEvent'


const move = {} as IPointData

@registerUIEvent()
export class DragEvent extends PointerEvent implements IDragEvent {

    static BEFORE_DRAG = 'drag.before_drag'

    static START = 'drag.start'
    static DRAG = 'drag'
    static END = 'drag.end'

    static OVER = 'drag.over'
    static OUT = 'drag.out'

    static ENTER = 'drag.enter'
    static LEAVE = 'drag.leave'

    readonly moveX: number
    readonly moveY: number
    readonly totalX: number
    readonly totalY: number

    static list: ILeafList
    static data: IObject

    static setList(data: ILeaf | ILeaf[] | ILeafList): void {
        this.list = data instanceof LeafList ? data : new LeafList(data as ILeaf[])
    }

    static setData(data: IObject): void {
        this.data = data
    }

    static getValidMove(leaf: ILeaf, start: IPointData, total: IPointData): IPointData {
        const { draggable, dragBounds, x, y } = leaf
        const move = leaf.getLocalPoint(total, null, true)
        move.x += start.x - x
        move.y += start.y - y
        if (dragBounds) this.getMoveInDragBounds(leaf.__local, dragBounds === 'parent' ? leaf.parent.boxBounds : dragBounds, move, true)
        if (draggable === 'x') move.y = 0
        if (draggable === 'y') move.x = 0
        return move
    }

    static getMoveInDragBounds(childBox: IBoundsData, dragBounds: IBoundsData, move: IPointData, change?: boolean): IPointData {
        const x = childBox.x + move.x, y = childBox.y + move.y
        const right = x + childBox.width, bottom = y + childBox.height
        const boundsRight = dragBounds.x + dragBounds.width, boundsBottom = dragBounds.y + dragBounds.height

        if (!change) move = { ...move }

        if (BoundsHelper.includes(childBox, dragBounds)) { // childBox > dragBounds
            if (x > dragBounds.x) move.x += dragBounds.x - x
            else if (right < boundsRight) move.x += boundsRight - right
            if (y > dragBounds.y) move.y += dragBounds.y - y
            else if (bottom < boundsBottom) move.y += boundsBottom - bottom
        } else {
            if (x < dragBounds.x) move.x += dragBounds.x - x
            else if (right > boundsRight) move.x += boundsRight - right
            if (y < dragBounds.y) move.y += dragBounds.y - y
            else if (bottom > boundsBottom) move.y += boundsBottom - bottom
        }

        return move
    }

    public getPageMove(total?: boolean): IPointData {
        this.assignMove(total)
        return this.current.getPagePoint(move, null, true)
    }

    public getInnerMove(relative?: ILeaf, total?: boolean): IPointData {
        if (!relative) relative = this.current
        this.assignMove(total)
        return relative.getInnerPoint(move, null, true)
    }

    public getLocalMove(relative?: ILeaf, total?: boolean): IPointData {
        if (!relative) relative = this.current
        this.assignMove(total)
        return relative.getLocalPoint(move, null, true)
    }

    public getPageTotal(): IPointData {
        return this.getPageMove(true)
    }

    public getInnerTotal(relative?: ILeaf): IPointData {
        return this.getInnerMove(relative, true)
    }

    public getLocalTotal(relative?: ILeaf): IPointData {
        return this.getLocalMove(relative, true)
    }

    public getPageBounds(): IBoundsData {
        const total = this.getPageTotal()
        const start = this.getPagePoint()
        const bounds = {} as IBoundsData
        BoundsHelper.set(bounds, start.x - total.x, start.y - total.y, total.x, total.y)
        BoundsHelper.unsign(bounds)
        return bounds
    }

    protected assignMove(total: boolean): void {
        move.x = total ? this.totalX : this.moveX
        move.y = total ? this.totalY : this.moveY
    }

}

export const MyDragEvent = DragEvent