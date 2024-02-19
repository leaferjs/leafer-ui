import { IPointerEvent, IDragEvent, ILeaf, ILeafList, ITimer, IFunction } from '@leafer/interface'
import { BoundsHelper, PointHelper, LeafHelper, LeafList } from '@leafer/core'

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

    public dragableList: ILeafList
    protected dragOverPath: ILeafList
    protected dragEnterPath: ILeafList

    protected autoMoveTimer: ITimer

    protected canAnimate: boolean
    protected animateWait: IFunction

    constructor(interaction: InteractionBase) {
        this.interaction = interaction
    }

    public setDragData(data: IPointerEvent): void { // pointer down
        if (this.animateWait) this.dragEndReal()
        this.downData = this.interaction.downData
        this.dragData = getDragEventData(data, data, data)
    }

    public getList(): ILeafList {
        const { proxy } = this.interaction.selector
        return this.dragging && (!proxy || !proxy.list.length) ? (DragEvent.list || this.dragableList || emptyList) : emptyList
    }

    public checkDrag(data: IPointerEvent, canDrag: boolean): void {
        const { interaction } = this

        if (this.moving && data.buttons < 1) {
            this.canAnimate = false // 防止dragEnd动画
            interaction.pointerCancel() // 按住中键/右键拖出页面后的up事件接收不到
            return
        } else {
            this.canAnimate = true
        }

        if (!this.moving && canDrag) {
            if (this.moving = interaction.moveMode || interaction.isHoldRightKey) interaction.emit(MoveEvent.START, this.dragData)
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
                this.getDragableList(this.dragData.path)
            }
        }
    }

    protected getDragableList(path: ILeafList): void {
        let leaf: ILeaf
        for (let i = 0, len = path.length; i < len; i++) {
            leaf = path.list[i]
            if ((leaf.__.draggable || leaf.__.editable) && leaf.__.hitSelf && !leaf.__.locked) {
                this.dragableList = new LeafList(leaf)
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
        const list = this.getList()
        if (list.length && running) {
            const { moveX, moveY } = this.dragData
            list.forEach(leaf => LeafHelper.moveWorld(leaf, moveX, moveY))
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
        if (!this.dragData) return

        const { moveX, moveY } = this.dragData
        if (this.canAnimate && this.moving && (Math.abs(moveX) > 1 || Math.abs(moveY) > 1)) {
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

        if (this.moving) interaction.emit(MoveEvent.END, endDragData)
        if (this.dragging) {
            interaction.emit(DragEvent.END, endDragData)

            this.swipe(data, endDragData)
            this.drop(data)
        }

        this.autoMoveCancel()
        this.dragReset()
        this.animate(null, 'off')
    }

    protected animate(func?: IFunction, off?: 'off'): void { // dragEnd animation
        const animateWait = func || this.animateWait
        if (animateWait) this.interaction.target.nextRender(animateWait, off)
        this.animateWait = func
    }


    protected swipe(data: IPointerEvent, endDragData: IDragEvent): void {
        const { interaction } = this
        const { downData } = interaction
        if (PointHelper.getDistance(downData, data) > interaction.config.pointer.swipeDistance) {
            const swipeData = getSwipeEventData(downData, this.dragData, endDragData)
            this.interaction.emit(swipeData.type, swipeData)
        }
    }

    protected drop(data: IPointerEvent): void {
        const dropData = getDropEventData(data, this.getList(), DragEvent.data)
        dropData.path = this.dragEnterPath
        this.interaction.emit(DropEvent.DROP, dropData)
        this.interaction.emit(DragEvent.LEAVE, data, this.dragEnterPath)
    }

    protected dragReset(): void {
        DragEvent.list = DragEvent.data = this.dragableList = this.dragData = this.downData = this.dragOverPath = this.dragEnterPath = null
        this.dragging = this.moving = false
    }


    public checkDragOut(data: IPointerEvent): void {
        const { interaction } = this
        this.autoMoveCancel()
        if (this.dragging && !interaction.shrinkCanvasBounds.hitPoint(data)) this.autoMoveOnDragOut(data)
    }


    protected autoMoveOnDragOut(data: IPointerEvent): void {
        const { interaction, downData } = this
        const { autoDistance, dragOut } = interaction.config.move
        if (!dragOut || !autoDistance) return

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

            interaction.move({ ...data, moveX, moveY, totalX, totalY })
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