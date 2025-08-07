import { IDragEvent, IPointData, ILeaf, ILeafList, IObject, IBoundsData } from '@leafer/interface'
import { registerUIEvent, LeafList, BoundsHelper, PointHelper } from '@leafer/core'

import { PointerEvent } from './PointerEvent'
import { DragBoundsHelper } from '@leafer-ui/interaction'


const tempMove = {} as IPointData

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

    static getValidMove(leaf: ILeaf, start: IPointData, total: IPointData, checkLimit = true): IPointData {
        const move = leaf.getLocalPoint(total, null, true)
        PointHelper.move(move, start.x - leaf.x, start.y - leaf.y)
        if (checkLimit) this.limitMove(leaf, move) // 检查拖拽限制
        return move
    }

    static limitMove(leaf: ILeaf, move: IPointData): void {
        const { draggable, dragBounds, dragBoundsType } = leaf
        if (dragBounds) DragBoundsHelper.getValidMove(leaf.__localBoxBounds, dragBounds === 'parent' ? leaf.parent.boxBounds : dragBounds, dragBoundsType, move, true)
        if (draggable === 'x') move.y = 0
        if (draggable === 'y') move.x = 0
    }

    public getPageMove(total?: boolean): IPointData {
        this.assignMove(total)
        return this.current.getPagePoint(tempMove, null, true)
    }

    public getInnerMove(relative?: ILeaf, total?: boolean): IPointData {
        if (!relative) relative = this.current
        this.assignMove(total)
        return relative.getInnerPoint(tempMove, null, true)
    }

    public getLocalMove(relative?: ILeaf, total?: boolean): IPointData {
        if (!relative) relative = this.current
        this.assignMove(total)
        return relative.getLocalPoint(tempMove, null, true)
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
        const total = this.getPageTotal(), start = this.getPagePoint(), bounds = {} as IBoundsData
        BoundsHelper.set(bounds, start.x - total.x, start.y - total.y, total.x, total.y)
        BoundsHelper.unsign(bounds)
        return bounds
    }

    protected assignMove(total: boolean): void {
        tempMove.x = total ? this.totalX : this.moveX
        tempMove.y = total ? this.totalY : this.moveY
    }

}

export const MyDragEvent = DragEvent