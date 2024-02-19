import { IUIEvent, IPointerEvent, ILeaf, IInteraction, IInteractionConfig, ILeafList, IMoveEvent, IZoomEvent, IRotateEvent, ISelector, IBounds, IEventListenerId, IInteractionCanvas, ITimer, IKeepTouchData, IKeyEvent, IPickOptions, ICursorType, IBooleanMap, IStateStyleType } from '@leafer/interface'
import { LeaferEvent, ResizeEvent, LeafList, Bounds, PointHelper, DataHelper } from '@leafer/core'

import { PointerEvent, DropEvent, KeyEvent, PointerButton, Keyboard } from '@leafer-ui/event'

import { Transformer } from './Transformer'
import { Dragger } from './Dragger'
import { emit } from './emit'
import { InteractionHelper } from './InteractionHelper'
import { MultiTouchHelper } from './MultiTouchHelper'
import { setStateStyle, unsetStateStyle } from './StateStyle'
import { config } from './config'


const { pathHasEventType, getMoveEventData, getZoomEventData, getRotateEventData } = InteractionHelper
export class InteractionBase implements IInteraction {

    public target: ILeaf
    public canvas: IInteractionCanvas
    public selector: ISelector

    public running: boolean

    public get dragging(): boolean { return this.dragger.dragging }
    public get isDragEmpty(): boolean { return this.config.move.dragEmpty && (this.hoverData && (this.hoverData.path.list[0] as ILeaf).isLeafer) && (!this.downData || (this.downData.path.list[0] as ILeaf).isLeafer) }
    public get isHoldRightKey(): boolean { return this.config.move.holdRightKey && this.downData && PointerButton.right(this.downData) }
    public get moveMode(): boolean { return this.config.move.drag || (this.config.move.holdSpaceKey && Keyboard.isHoldSpaceKey()) || (this.downData && ((this.config.move.holdMiddleKey && PointerButton.middle(this.downData)) || (this.isHoldRightKey && this.dragger.moving))) || this.isDragEmpty }

    public config: IInteractionConfig = config

    public cursor: ICursorType | ICursorType[]
    public get hitRadius(): number { return this.config.pointer.hitRadius }

    public shrinkCanvasBounds: IBounds

    public downData: IPointerEvent
    protected oldDownData?: IPointerEvent // 通过updateDownData强制更新下来的数据
    public hoverData: IPointerEvent

    public downTime: number
    protected downed: boolean

    protected overPath: LeafList
    protected enterPath: LeafList

    protected waitMenuTap: boolean
    protected waitTap: boolean
    protected longPressTimer: ITimer
    protected longPressed: boolean
    protected tapCount = 0
    protected tapTimer: ITimer

    protected dragger: Dragger
    protected transformer: Transformer

    protected __eventIds: IEventListenerId[]
    protected defaultPath: ILeafList

    protected downKeyMap: IBooleanMap = {}

    constructor(target: ILeaf, canvas: IInteractionCanvas, selector: ISelector, userConfig?: IInteractionConfig) {
        this.target = target
        this.canvas = canvas
        this.selector = selector
        this.defaultPath = new LeafList(target)

        this.transformer = new Transformer(this)
        this.dragger = new Dragger(this)

        if (userConfig) this.config = DataHelper.default(userConfig, this.config)
        this.__listenEvents()
    }


    public start(): void {
        this.running = true
    }

    public stop(): void {
        this.running = false
    }


    public receive(_event: any): void { }


    public pointerDown(data?: IPointerEvent, useDefaultPath?: boolean): void {
        if (!data) data = this.hoverData
        if (!data) return
        PointerButton.defaultLeft(data)

        this.updateDownData(data)
        if (useDefaultPath) data.path = this.defaultPath

        this.downTime = Date.now()
        this.dragger.setDragData(data)

        if (this.downed = !this.moveMode) {
            this.emit(PointerEvent.BEFORE_DOWN, data)
            this.emit(PointerEvent.DOWN, data)

            if (PointerButton.left(data)) {
                this.tapWait()
                this.longPressWait(data)
            } else if (PointerButton.right(data)) {
                this.waitMenuTap = true
            }
        }

        this.updateCursor(data)
    }

    public pointerMove(data?: IPointerEvent): void {
        if (!data) data = this.hoverData
        if (!data) return
        if (this.downData) PointerButton.defaultLeft(data)

        const hit = this.canvas.bounds.hitPoint(data)
        if (hit || this.downData) {
            if (hit && !this.downData && PointerButton.left(data)) this.pointerDown(data, true) // 从外部拖拽内容进入，需要先模拟down事件
            this.pointerMoveReal(data)
            this.dragger.checkDragOut(data)
        }
    }

    public pointerMoveReal(data: IPointerEvent): void {
        this.emit(PointerEvent.BEFORE_MOVE, data, this.defaultPath)

        if (this.downData) {
            const canDrag = PointHelper.getDistance(this.downData, data) > this.config.pointer.dragDistance
            if (canDrag) {
                if (this.waitTap) this.pointerWaitCancel()
                this.waitMenuTap = false
            }

            this.dragger.checkDrag(data, canDrag)
        }

        if (!this.dragger.moving) {
            this.updateHoverData(data)
            if (this.moveMode) data.path = this.defaultPath

            this.emit(PointerEvent.MOVE, data)

            if (!(this.dragging && !this.config.pointer.dragHover)) {
                this.pointerOverOrOut(data)
                this.pointerEnterOrLeave(data)
            }

            if (this.dragger.dragging) {
                this.dragger.dragOverOrOut(data)
                this.dragger.dragEnterOrLeave(data)
            }
        }

        this.updateCursor(this.downData || data)
    }

    public pointerUp(data?: IPointerEvent): void {
        const { downData, oldDownData } = this
        if (!data) data = downData
        if (!downData) return
        PointerButton.defaultLeft(data)

        this.findPath(data)

        if (this.downed) {
            this.downed = false
            this.emit(PointerEvent.BEFORE_UP, data)
            this.emit(PointerEvent.UP, data)
            if (oldDownData) this.emit(PointerEvent.UP, oldDownData, undefined, data.path) // oldDownPath必须触发up
            this.emit(PointerEvent.UP, downData, undefined, data.path) // downPath必须触发up

            this.touchLeave(data)

            this.tap(data)
            this.menuTap(data)
        }

        this.dragger.dragEnd(data)

        this.downData = this.oldDownData = null

        this.updateCursor(data)
    }

    public pointerCancel(): void {
        this.pointerUp(this.dragger.dragData)
    }


    public multiTouch(data: IUIEvent, list: IKeepTouchData[]): void {
        const { move, angle, scale, center } = MultiTouchHelper.getData(list)
        this.rotate(getRotateEventData(center, angle, data))
        this.zoom(getZoomEventData(center, scale, data))
        this.move(getMoveEventData(center, move, data))
    }

    // context menu

    public menu(data: IPointerEvent): void {
        this.findPath(data)
        this.emit(PointerEvent.MENU, data)
    }

    public menuTap(data: IPointerEvent): void {
        if (this.waitMenuTap) this.emit(PointerEvent.MENU_TAP, data)
    }

    // window transform

    public move(data: IMoveEvent): void {
        this.transformer.move(data)
    }

    public zoom(data: IZoomEvent): void {
        this.transformer.zoom(data)
    }

    public rotate(data: IRotateEvent): void {
        this.transformer.rotate(data)
    }

    public transformEnd(): void {
        this.transformer.transformEnd()
    }


    // key

    public keyDown(data: IKeyEvent): void {
        const { code } = data
        if (!this.downKeyMap[code]) {
            this.downKeyMap[code] = true
            Keyboard.setDownCode(code)

            this.emit(KeyEvent.HOLD, data, this.defaultPath)
            if (this.moveMode) {
                this.pointerMoveReal(this.hoverData) // remove hoverStyle
                this.updateCursor()
            }
        }
        this.emit(KeyEvent.DOWN, data, this.defaultPath)
    }

    public keyUp(data: IKeyEvent): void {
        const { code } = data
        this.downKeyMap[code] = false
        Keyboard.setUpCode(code)

        this.emit(KeyEvent.UP, data, this.defaultPath)
        if (this.cursor === 'grab') this.updateCursor()
    }


    // helper
    protected pointerOverOrOut(data: IPointerEvent): void {
        const { path } = data
        const { overPath } = this
        this.overPath = path

        if (overPath) {
            if (path.indexAt(0) !== overPath.indexAt(0)) {
                this.emit(PointerEvent.OUT, data, overPath)
                this.emit(PointerEvent.OVER, data, path)
            }
        } else {
            this.emit(PointerEvent.OVER, data, path)
        }
    }

    protected pointerEnterOrLeave(data: IPointerEvent): void {
        let { path } = data

        if (this.downData && !this.moveMode) {
            path = path.clone()
            this.downData.path.forEach(leaf => path.add(leaf))
        }

        const { enterPath } = this
        this.enterPath = path

        this.emit(PointerEvent.LEAVE, data, enterPath, path)
        this.emit(PointerEvent.ENTER, data, path, enterPath)
    }

    protected touchLeave(data: IPointerEvent): void {
        if (data.pointerType === 'touch') {
            if (this.enterPath) {
                this.emit(PointerEvent.LEAVE, data)
                if (this.dragger.dragging) this.emit(DropEvent.LEAVE, data)
            }
        }
    }

    protected tap(data: IPointerEvent): void {
        const { pointer } = this.config

        const longTap = this.longTap(data)
        if (!pointer.tapMore && longTap) return

        if (!this.waitTap) return
        if (pointer.tapMore) this.emitTap(data)

        const useTime = Date.now() - this.downTime

        const hasDouble = [PointerEvent.DOUBLE_TAP, PointerEvent.DOUBLE_CLICK].some(type => pathHasEventType(data.path, type))

        if (useTime < pointer.tapTime + 50 && hasDouble) {

            this.tapCount++
            if (this.tapCount === 2) {
                this.tapWaitCancel()
                this.emitDoubleTap(data)
            } else {
                clearTimeout(this.tapTimer)
                this.tapTimer = setTimeout(() => {
                    if (!pointer.tapMore) {
                        this.tapWaitCancel()
                        this.emitTap(data)
                    }
                }, pointer.tapTime)
            }

        } else {

            if (!pointer.tapMore) {
                this.tapWaitCancel()
                this.emitTap(data)
            }
        }
    }


    // update
    public findPath(data: IPointerEvent, options?: IPickOptions): ILeafList {
        const { hitRadius, through } = this.config.pointer
        const find = this.selector.getByPoint(data, hitRadius, options || { through })
        if (find.throughPath) data.throughPath = find.throughPath
        data.path = find.path
        return find.path
    }


    public isDrag(leaf: ILeaf): boolean {
        return this.dragger.getList().has(leaf)
    }

    public isPress(leaf: ILeaf): boolean {
        const { downData, oldDownData } = this
        return this.downed && ((downData && downData.path.has(leaf)) || (oldDownData && oldDownData.path.has(leaf)))
    }

    public isHover(leaf: ILeaf): boolean {
        return this.enterPath && this.enterPath.has(leaf)
    }


    public updateDownData(data?: IPointerEvent, options?: IPickOptions): void {
        const { downData } = this
        if (!data && downData) data = { ...downData }
        if (!data) return
        this.oldDownData = downData
        this.findPath(data, options)
        this.downData = data
    }

    public updateHoverData(data?: IPointerEvent): void {
        if (!data) data = this.hoverData
        if (!data) return
        this.findPath(data, { exclude: this.dragger.getList(), name: PointerEvent.MOVE })
        this.hoverData = data
    }


    public setStateStyle(leaf: ILeaf, stateType: IStateStyleType): void {
        setStateStyle(leaf, stateType)
    }

    public unsetStateStyle(leaf: ILeaf, stateType: IStateStyleType): void {
        unsetStateStyle(leaf, stateType)
    }

    public updateCursor(data?: IPointerEvent): void {
        if (this.config.cursor.stop) return

        if (!data) {
            this.updateHoverData()
            data = this.downData || this.hoverData
        }

        if (this.dragger.moving) {
            return this.setCursor('grabbing')
        } else if (this.moveMode) {
            return this.setCursor(this.downData ? 'grabbing' : 'grab')
        } else if (!data) return

        let leaf: ILeaf, cursor: ICursorType | ICursorType[]

        const { path } = data
        for (let i = 0, len = path.length; i < len; i++) {
            leaf = path.list[i]
            cursor = leaf.cursor
            if (cursor) break
        }

        this.setCursor(cursor)
    }

    public setCursor(cursor: ICursorType | ICursorType[]): void {
        this.cursor = cursor
    }


    protected emitTap(data: IPointerEvent) {
        this.emit(PointerEvent.TAP, data)
        this.emit(PointerEvent.CLICK, data)
    }

    protected emitDoubleTap(data: IPointerEvent) {
        this.emit(PointerEvent.DOUBLE_TAP, data)
        this.emit(PointerEvent.DOUBLE_CLICK, data)
    }

    public pointerWaitCancel(): void {
        this.tapWaitCancel()
        this.longPressWaitCancel()
    }

    protected tapWait(): void {
        clearTimeout(this.tapTimer)
        this.waitTap = true
    }

    protected tapWaitCancel(): void {
        clearTimeout(this.tapTimer)
        this.waitTap = false
        this.tapCount = 0
    }

    protected longPressWait(data: IPointerEvent): void {
        clearTimeout(this.longPressTimer)
        this.longPressTimer = setTimeout(() => {
            this.longPressed = true
            this.emit(PointerEvent.LONG_PRESS, data)
        }, this.config.pointer.longPressTime)
    }

    protected longTap(data: IPointerEvent): boolean {
        let longTap
        if (this.longPressed) {
            this.emit(PointerEvent.LONG_TAP, data)
            if (pathHasEventType(data.path, PointerEvent.LONG_TAP)) longTap = true
        }
        this.longPressWaitCancel()
        return longTap
    }

    protected longPressWaitCancel(): void {
        clearTimeout(this.longPressTimer)
        this.longPressed = false
    }

    protected __onResize(): void {
        this.shrinkCanvasBounds = new Bounds(this.canvas.bounds)
        this.shrinkCanvasBounds.spread(-2)
    }

    protected __listenEvents(): void {
        const { target } = this
        this.__eventIds = [target.on_(ResizeEvent.RESIZE, this.__onResize, this)]
        target.once(LeaferEvent.READY, () => this.__onResize())
    }

    protected __removeListenEvents(): void {
        this.target.off_(this.__eventIds)
        this.__eventIds.length = 0
    }


    public emit(type: string, data: IUIEvent, path?: ILeafList, excludePath?: ILeafList): void {
        if (this.running) emit(type, data, path, excludePath)
    }


    public destroy(): void {
        if (this.__eventIds.length) {
            this.stop()
            this.__removeListenEvents()
            this.dragger.destroy()
            this.transformer.destroy()
            this.downData = this.overPath = this.enterPath = null
        }
    }

}