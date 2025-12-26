import { IPointerEvent, IDragEvent, ILeaf, ILeafList, ITimer, IFunction, IPointDataMap, IMoveEvent } from '@leafer/interface'
import { PointHelper, LeafList, LeafHelper, isNumber, isString } from '@leafer/core'

import { MoveEvent, DragEvent, DropEvent, PointerButton } from '@leafer-ui/event'

import { InteractionHelper } from './InteractionHelper'
import { InteractionBase } from './Interaction'


const emptyList = new LeafList()
const { getDragEventData, getDropEventData, getSwipeEventData } = InteractionHelper

export class Dragger {

    public interaction: InteractionBase

    public moving: boolean
    public dragging: boolean

    public dragData: IDragEvent
    public downData: IPointerEvent

    public dragDataList: IDragEvent[] = [] // 记录列表备用

    public draggableList: ILeafList
    public realDraggableList: ILeafList
    protected dragOverPath: ILeafList
    protected dragEnterPath: ILeafList

    public dragStartPoints: IPointDataMap
    public autoMoveTimer: ITimer

    public canAnimate: boolean
    public canDragOut: boolean
    public animateWait: IFunction

    constructor(interaction: InteractionBase) {
        this.interaction = interaction
    }

    public setDragData(data: IPointerEvent): void { // pointer down
        if (this.animateWait) this.dragEndReal()
        this.downData = this.interaction.downData
        this.dragData = getDragEventData(data, data, data)
        this.canAnimate = this.canDragOut = true
    }

    public getList(realDraggable?: boolean, hover?: boolean): ILeafList {
        const { proxy } = this.interaction.selector
        const hasProxyList = proxy && proxy.list.length, dragList = DragEvent.list || this.draggableList || emptyList
        return this.dragging && (hasProxyList ? (realDraggable ? emptyList : new LeafList(hover ? [...proxy.list, ...proxy.dragHoverExclude] : proxy.list)) : dragList) // realDraggable 需排除代理选择器，它有自身的拖拽逻辑
    }

    public checkDrag(data: IPointerEvent, canDrag: boolean): void {
        const { interaction } = this

        if (this.moving && data.buttons < 1) {
            this.canAnimate = false // 防止dragEnd动画
            interaction.pointerCancel() // 按住中键/右键拖出页面后的up事件接收不到
            return
        }

        if (!this.moving && canDrag) {
            if (this.moving = interaction.canMove(this.downData) || interaction.isHoldRightKey || interaction.isMobileDragEmpty) {
                (this.dragData as IMoveEvent).moveType = 'drag'
                interaction.emit(MoveEvent.START, this.dragData)
            }
        }

        if (!this.moving) this.dragStart(data, canDrag)

        this.drag(data)
    }

    public dragStart(data: IPointerEvent, canDrag: boolean): void {
        if (!this.dragging) {
            this.dragging = canDrag && PointerButton.left(data)
            if (this.dragging) {
                this.interaction.emit(DragEvent.START, this.dragData)
                this.getDraggableList(this.dragData.path)
                this.setDragStartPoints(this.realDraggableList = this.getList(true))
            }
        }
    }

    protected setDragStartPoints(list: ILeafList | ILeaf[]): void {
        this.dragStartPoints = {}
        list.forEach(leaf => this.dragStartPoints[leaf.innerId] = { x: leaf.x, y: leaf.y })
    }

    protected getDraggableList(path: ILeafList): void {
        let leaf: ILeaf
        for (let i = 0, len = path.length; i < len; i++) {
            leaf = path.list[i]
            if (LeafHelper.draggable(leaf)) {
                this.draggableList = new LeafList(leaf)
                break
            }
        }
    }

    public drag(data: IPointerEvent): void {
        const { interaction, dragData, downData } = this
        const { path, throughPath } = downData
        this.dragData = getDragEventData(downData, dragData, data)
        if (throughPath) this.dragData.throughPath = throughPath
        this.dragData.path = path

        this.dragDataList.push(this.dragData)

        if (this.moving) {
            data.moving = true;
            (this.dragData as IMoveEvent).moveType = 'drag'
            interaction.emit(MoveEvent.BEFORE_MOVE, this.dragData)
            interaction.emit(MoveEvent.MOVE, this.dragData)
        } else if (this.dragging) {
            data.dragging = true
            this.dragReal()
            interaction.emit(DragEvent.BEFORE_DRAG, this.dragData)
            interaction.emit(DragEvent.DRAG, this.dragData)
        }
    }

    protected dragReal(isDragEnd?: boolean): void {
        const { interaction } = this, { running } = interaction
        const list = this.realDraggableList
        if (list.length && running) {
            const { totalX, totalY } = this.dragData, { dragLimitAnimate } = interaction.p
            const checkLimitMove = !dragLimitAnimate || !!isDragEnd
            list.forEach(leaf => {
                if (leaf.draggable) {
                    const axisDrag = isString(leaf.draggable)
                    const move = DragEvent.getValidMove(leaf, this.dragStartPoints[leaf.innerId], { x: totalX, y: totalY }, checkLimitMove || axisDrag)
                    if (dragLimitAnimate && !axisDrag && isDragEnd) LeafHelper.animateMove(leaf, move, isNumber(dragLimitAnimate) ? dragLimitAnimate : 0.3)
                    else leaf.move(move)
                }
            })
        }
    }

    public dragOverOrOut(data: IPointerEvent): void {
        const { interaction } = this
        const { dragOverPath } = this
        const { path } = data
        this.dragOverPath = path

        if (dragOverPath) {
            if (path.indexAt(0) !== dragOverPath.indexAt(0)) {
                interaction.emit(DragEvent.OUT, data, dragOverPath)
                interaction.emit(DragEvent.OVER, data, path)
            }
        } else interaction.emit(DragEvent.OVER, data, path)
    }

    public dragEnterOrLeave(data: IPointerEvent): void {
        const { interaction } = this
        const { dragEnterPath } = this
        const { path } = data

        interaction.emit(DragEvent.LEAVE, data, dragEnterPath, path)
        interaction.emit(DragEvent.ENTER, data, path, dragEnterPath)
        this.dragEnterPath = path
    }

    public dragEnd(data: IPointerEvent): void {
        if (!this.dragging && !this.moving) return
        if (this.checkDragEndAnimate(data)) return
        this.dragEndReal(data)
    }

    public dragEndReal(data?: IPointerEvent): void {
        const { interaction, downData, dragData } = this
        if (!data) data = dragData
        const { path, throughPath } = downData
        const endDragData = getDragEventData(downData, data, data)
        if (throughPath) endDragData.throughPath = throughPath
        endDragData.path = path

        if (this.moving) {
            this.moving = false;
            (endDragData as IMoveEvent).moveType = 'drag'
            interaction.emit(MoveEvent.END, endDragData)
        }

        if (this.dragging) {
            const dropList = this.getList()

            this.dragging = false
            if (interaction.p.dragLimitAnimate) this.dragReal(true)
            interaction.emit(DragEvent.END, endDragData)

            this.swipe(data, downData, dragData, endDragData)
            this.drop(data, dropList, this.dragEnterPath)
        }

        this.autoMoveCancel()
        this.dragReset()
        this.animate(null, 'off')
    }


    protected swipe(data: IPointerEvent, downData: IPointerEvent, dragData: IDragEvent, endDragData: IDragEvent): void {
        const { interaction } = this
        if (PointHelper.getDistance(downData, data) > interaction.config.pointer.swipeDistance) {
            const swipeData = getSwipeEventData(downData, dragData, endDragData)
            this.interaction.emit(swipeData.type, swipeData)
        }
    }

    protected drop(data: IPointerEvent, dropList: ILeafList, dragEnterPath: ILeafList): void {
        const dropData = getDropEventData(data, dropList, DragEvent.data)
        dropData.path = dragEnterPath
        this.interaction.emit(DropEvent.DROP, dropData)
        this.interaction.emit(DragEvent.LEAVE, data, dragEnterPath)
    }

    protected dragReset(): void {
        DragEvent.list = DragEvent.data = this.draggableList = this.dragData = this.downData = this.dragOverPath = this.dragEnterPath = null
        this.dragDataList = []
    }


    // @leafer-in/viewport will rewrite

    public checkDragEndAnimate(_data: IPointerEvent, _speed?: number): boolean | number { return false }

    public animate(_func?: IFunction, _off?: 'off'): void { }  // dragEnd animation

    public stopAnimate(): void { }

    public checkDragOut(_data: IPointerEvent): void { }

    public autoMoveOnDragOut(_data: IPointerEvent): void { }

    public autoMoveCancel(): void { }

    // ---

    public destroy(): void {
        this.dragReset()
    }
}