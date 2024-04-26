import { IDragEvent, IPointData, ILeaf, ILeafList, IObject, IBoundsData, IPointDataMap } from '@leafer/interface'
import { registerUIEvent, LeafList } from '@leafer/core'

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
    static startPoints: IPointDataMap

    static setList(data: ILeaf | ILeaf[] | ILeafList): void {
        this.list = data instanceof LeafList ? data : new LeafList(data as ILeaf[])
    }

    static setData(data: IObject): void {
        this.data = data
    }

    static setStartPoint(list: ILeafList | ILeaf[]): void {
        this.startPoints = {}
        list.forEach(leaf => this.startPoints[leaf.innerId] = { x: leaf.x, y: leaf.y })
    }

    static dragTo(leaf: ILeaf, total: IPointData): void {
        const start = this.startPoints[leaf.innerId]
        const { draggable, dragBounds } = leaf
        leaf.worldToLocal(total, total, true)
        total.x += start.x - leaf.x, total.y += start.y - leaf.y
        if (dragBounds) this.getMoveInDragBounds(leaf.getBounds('box', 'local'), dragBounds, total, true)
        leaf.move(draggable === 'y' ? 0 : total.x, draggable === 'x' ? 0 : total.y)
    }

    static getMoveInDragBounds(box: IBoundsData, dragBounds: IBoundsData, move: IPointData, change?: boolean): IPointData {
        const x = box.x + move.x, y = box.y + move.y
        const right = x + box.width, bottom = y + box.height
        const boundsRight = dragBounds.x + dragBounds.width, boundsBottom = dragBounds.y + dragBounds.height
        if (!change) move = { ...move }
        if (x < dragBounds.x) move.x += dragBounds.x - x
        else if (right > boundsRight) move.x += boundsRight - right
        if (y < dragBounds.y) move.y += dragBounds.y - y
        else if (bottom > boundsBottom) move.y += boundsBottom - bottom
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

    protected assignMove(total: boolean): void {
        move.x = total ? this.totalX : this.moveX
        move.y = total ? this.totalY : this.moveY
    }

}