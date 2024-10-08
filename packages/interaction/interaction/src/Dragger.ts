import { IPointerEvent, IDragEvent, ILeaf, ILeafList, ITimer, IFunction, IPointDataMap, IMoveEvent } from '@leafer/interface'
import { BoundsHelper, PointHelper, LeafList } from '@leafer/core'

import { MoveEvent, DragEvent, DropEvent, PointerButton } from '@leafer-ui/event'

import { InteractionHelper } from './InteractionHelper'
import { InteractionBase } from './Interaction'


const emptyList = new LeafList()
const { getDragEventData, getDropEventData, getSwipeEventData } = InteractionHelper

export class Dragger {

    protected interaction: InteractionBase

    public moving: boolean
    public dragging: boolean

    public dragData: IDragEvent
    protected downData: IPointerEvent

    public draggableList: ILeafList
    public realDraggableList: ILeafList
    protected dragOverPath: ILeafList
    protected dragEnterPath: ILeafList

    protected dragStartPoints: IPointDataMap
    protected autoMoveTimer: ITimer

    public canAnimate: boolean
    public canDragOut: boolean
    protected animateWait: IFunction

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

        if (!this.moving) {
            this.dragStart(data, canDrag)
        }

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
            if ((leaf.draggable || leaf.editable) && leaf.hitSelf && !leaf.locked) {
                this.draggableList = new LeafList(leaf)
                break
            }
        }
    }

    protected drag(data: IPointerEvent): void {
        const { interaction, dragData, downData } = this
        const { path, throughPath } = downData
        this.dragData = getDragEventData(downData, dragData, data)
        if (throughPath) this.dragData.throughPath = throughPath
        this.dragData.path = path

        if (this.moving) {
            (this.dragData as IMoveEvent).moveType = 'drag'
            interaction.emit(MoveEvent.BEFORE_MOVE, this.dragData)
            interaction.emit(MoveEvent.MOVE, this.dragData)
        } else if (this.dragging) {
            this.dragReal()
            interaction.emit(DragEvent.BEFORE_DRAG, this.dragData)
            interaction.emit(DragEvent.DRAG, this.dragData)
        }
    }

    protected dragReal(): void {
        const { running } = this.interaction
        const list = this.realDraggableList
        if (list.length && running) {
            const { totalX, totalY } = this.dragData
            list.forEach(leaf => leaf.draggable && leaf.move(DragEvent.getValidMove(leaf, this.dragStartPoints[leaf.innerId], { x: totalX, y: totalY })))
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
        } else {
            interaction.emit(DragEvent.OVER, data, path)
        }

    }

    public dragEnterOrLeave(data: IPointerEvent): void {
        const { interaction } = this
        const { dragEnterPath } = this
        const { path } = data

        interaction.emit(DragEvent.LEAVE, data, dragEnterPath, path)
        interaction.emit(DragEvent.ENTER, data, path, dragEnterPath)
        this.dragEnterPath = path
    }

    public dragEnd(data: IPointerEvent, speed?: number): void {
        if (!this.dragging && !this.moving) return

        const { moveX, moveY } = this.dragData
        if (this.interaction.config.move.dragAnimate && this.canAnimate && this.moving && (Math.abs(moveX) > 1 || Math.abs(moveY) > 1)) {
            data = { ...data }
            speed = (speed || (data.pointerType === 'touch' ? 2 : 1)) * 0.9
            PointHelper.move(data, moveX * speed, moveY * speed)

            this.drag(data)
            this.animate(() => { this.dragEnd(data, 1) })

        } else {
            this.dragEndReal(data)
        }
    }

    protected dragEndReal(data?: IPointerEvent): void {
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
            interaction.emit(DragEvent.END, endDragData)

            this.swipe(data, downData, dragData, endDragData)
            this.drop(data, dropList, this.dragEnterPath)
        }

        this.autoMoveCancel()
        this.dragReset()
        this.animate(null, 'off')
    }

    protected animate(func?: IFunction, off?: 'off'): void { // dragEnd animation
        const animateWait = func || this.animateWait
        if (animateWait) this.interaction.target.nextRender(animateWait, null, off)
        this.animateWait = func
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
    }


    public checkDragOut(data: IPointerEvent): void {
        const { interaction } = this
        this.autoMoveCancel()
        if (this.dragging && !interaction.shrinkCanvasBounds.hitPoint(data)) this.autoMoveOnDragOut(data)
    }


    protected autoMoveOnDragOut(data: IPointerEvent): void {
        const { interaction, downData, canDragOut } = this
        const { autoDistance, dragOut } = interaction.config.move
        if (!dragOut || !canDragOut || !autoDistance) return

        const bounds = interaction.shrinkCanvasBounds
        const { x, y } = bounds
        const right = BoundsHelper.maxX(bounds)
        const bottom = BoundsHelper.maxY(bounds)

        const moveX = data.x < x ? autoDistance : (right < data.x ? -autoDistance : 0)
        const moveY = data.y < y ? autoDistance : (bottom < data.y ? -autoDistance : 0)
        let totalX = 0, totalY = 0

        this.autoMoveTimer = setInterval(() => {
            totalX += moveX
            totalY += moveY

            PointHelper.move(downData, moveX, moveY)
            PointHelper.move(this.dragData, moveX, moveY)

            interaction.move({ ...data, moveX, moveY, totalX, totalY, moveType: 'drag' })
            interaction.pointerMoveReal(data)
        }, 10)
    }

    protected autoMoveCancel(): void {
        if (this.autoMoveTimer) {
            clearInterval(this.autoMoveTimer)
            this.autoMoveTimer = 0
        }
    }

    public destroy(): void {
        this.dragReset()
    }
}