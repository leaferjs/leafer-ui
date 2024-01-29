import { IDragEvent, IPointData, ILeaf, ILeafList, IObject } from '@leafer/interface'
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

    static setList(data: ILeaf | ILeaf[] | ILeafList): void {
        this.list = data instanceof LeafList ? data : new LeafList(data as ILeaf[])
    }

    static setData(data: IObject): void {
        this.data = data
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