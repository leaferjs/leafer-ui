import { IUIEvent, IPointerEvent, ILeaf, IInteraction, IInteractionConfig, ITransformer, ILeafList, IMoveEvent, IZoomEvent, IRotateEvent, IWheelEvent, ISelector, IBounds, IEventListenerId, IInteractionCanvas, ITimer, IKeepTouchData, IKeyEvent, IPickOptions, ICursorType, IBooleanMap, IPickBottom, IClientPointData, IPointData, ILeaferConfig, IMoveConfig, IPointerConfig } from '@leafer/interface'
import { LeaferEvent, ResizeEvent, LeafList, Bounds, PointHelper, DataHelper, Platform, isNumber } from '@leafer/core'

import { IApp } from '@leafer-ui/interface'
import { PointerEvent, DropEvent, KeyEvent, PointerButton, Keyboard } from '@leafer-ui/event'

import { Dragger } from './Dragger'
import { emit } from './emit'
import { InteractionHelper } from './InteractionHelper'
import { config } from './config'


const { pathHasEventType, pathCanDrag, pathHasOutside } = InteractionHelper
export class InteractionBase implements IInteraction {

    public target: ILeaf
    public canvas: IInteractionCanvas
    public selector: ISelector

    public running: boolean

    public get dragging(): boolean { return this.dragger.dragging }
    public get transforming(): boolean { return this.transformer.transforming }

    public get moveMode(): boolean { return this.m.drag === true || this.isHoldSpaceKey || this.isHoldMiddleKey || (this.isHoldRightKey && this.dragger.moving) || this.isDragEmpty }
    public get canHover(): boolean { return this.p.hover && !(this.config as ILeaferConfig).mobile }

    public get isDragEmpty(): boolean { return this.m.dragEmpty && this.isRootPath(this.hoverData) && (!this.downData || this.isRootPath(this.downData)) }
    public get isMobileDragEmpty(): boolean { return this.m.dragEmpty && !this.canHover && this.downData && this.isTreePath(this.downData) }
    public get isHoldMiddleKey(): boolean { return this.m.holdMiddleKey && this.downData && PointerButton.middle(this.downData) }
    public get isHoldRightKey(): boolean { return this.m.holdRightKey && this.downData && PointerButton.right(this.downData) }
    public get isHoldSpaceKey(): boolean { return this.m.holdSpaceKey && Keyboard.isHoldSpaceKey() }

    public config: IInteractionConfig = DataHelper.clone(config)
    public get m(): IMoveConfig { return this.config.move }
    public get p(): IPointerConfig { return this.config.pointer }

    public cursor: ICursorType | ICursorType[]
    public get hitRadius(): number { return this.p.hitRadius }

    public bottomList?: IPickBottom[]

    public shrinkCanvasBounds: IBounds

    public downData: IPointerEvent
    public hoverData: IPointerEvent
    public focusData: ILeaf

    public downTime: number

    protected overPath: LeafList
    protected enterPath: LeafList

    protected waitMenuTap: boolean
    protected waitRightTap: boolean
    protected waitTap: boolean
    protected longPressTimer: ITimer
    protected longPressed: boolean
    protected tapCount = 0
    protected tapTimer: ITimer

    public dragger: Dragger
    public transformer: ITransformer

    protected __eventIds: IEventListenerId[]
    protected defaultPath: ILeafList

    protected downKeyMap: IBooleanMap = {}

    constructor(target: ILeaf, canvas: IInteractionCanvas, selector: ISelector, userConfig?: IInteractionConfig) {
        this.target = target
        this.canvas = canvas
        this.selector = selector
        this.defaultPath = new LeafList(target)

        this.createTransformer()
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
        this.checkPath(data, useDefaultPath)

        this.downTime = Date.now()

        this.emit(PointerEvent.BEFORE_DOWN, data) // downData maybe changed
        this.emit(PointerEvent.DOWN, data)

        if (PointerButton.left(data)) {
            this.tapWait()
            this.longPressWait(data)
        }

        this.waitRightTap = PointerButton.right(data)

        this.dragger.setDragData(data) // must after down event
        if (!this.isHoldRightKey) this.updateCursor(data)
    }

    public pointerMove(data?: IPointerEvent): void {
        if (!data) data = this.hoverData
        if (!data) return

        const { downData } = this
        if (downData) PointerButton.defaultLeft(data)

        const hit = this.canvas.bounds.hitPoint(data)
        if (hit || downData) {
            this.pointerMoveReal(data)
            if (downData) this.dragger.checkDragOut(data)
        }
    }

    public pointerMoveReal(data: IPointerEvent): void {
        this.emit(PointerEvent.BEFORE_MOVE, data, this.defaultPath)

        if (this.downData) {
            const canDrag = PointHelper.getDistance(this.downData, data) > this.p.dragDistance
            if (canDrag) {
                this.pointerWaitCancel()
                this.waitRightTap = false
            }

            this.dragger.checkDrag(data, canDrag)
        }

        if (!this.dragger.moving) {
            this.updateHoverData(data)
            this.checkPath(data)

            this.emit(PointerEvent.MOVE, data)

            this.pointerHover(data)

            if (this.dragging) {
                this.dragger.dragOverOrOut(data)
                this.dragger.dragEnterOrLeave(data)
            }
        }

        this.updateCursor(this.downData || data)
    }

    public pointerUp(data?: IPointerEvent): void {
        const { downData } = this
        if (!data) data = downData
        if (!downData) return

        PointerButton.defaultLeft(data)
        data.multiTouch = downData.multiTouch

        this.findPath(data)
        const upData = { ...data, path: data.path.clone() }

        data.path.addList(downData.path.list)  // downPath必须触发

        this.checkPath(data)

        this.downData = null // must before pointer.up event
        this.emit(PointerEvent.BEFORE_UP, data)
        this.emit(PointerEvent.UP, data)

        this.touchLeave(data)

        if (!data.isCancel) {
            this.tap(data)
            this.menuTap(data)
        }

        this.dragger.dragEnd(data)

        this.updateCursor(upData)
    }

    public pointerCancel(): void {
        const data = { ...this.dragger.dragData }
        data.isCancel = true
        this.pointerUp(data)
    }


    // context menu
    public menu(data: IPointerEvent): void {
        this.findPath(data)
        this.emit(PointerEvent.MENU, data)
        this.waitMenuTap = true
        if (!this.downData && this.waitRightTap) this.menuTap(data) // fix: Windows 触摸屏双击右键菜单事件会在pointer.up之后触发
    }

    public menuTap(data: IPointerEvent): void {
        if (this.waitRightTap && this.waitMenuTap) {
            this.emit(PointerEvent.MENU_TAP, data)
            this.waitRightTap = this.waitMenuTap = false
        }
    }

    // @leafer-in/viewport will rewrite:  transform viewport

    public createTransformer(): void { }

    public move(_data: IMoveEvent): void { }

    public zoom(_data: IZoomEvent): void { }

    public rotate(_data: IRotateEvent): void { }

    public transformEnd(): void { }

    public wheel(_data: IWheelEvent): void { }

    public multiTouch(_data: IUIEvent, _list: IKeepTouchData[]): void { }

    // ---

    // key

    public keyDown(data: IKeyEvent): void {
        if (!this.config.keyEvent) return

        this.emit(KeyEvent.BEFORE_DOWN, data, this.defaultPath) // 键盘按下前出发，还没有setDownCode

        const { code } = data
        if (!this.downKeyMap[code]) {
            this.downKeyMap[code] = true
            Keyboard.setDownCode(code)

            this.emit(KeyEvent.HOLD, data, this.defaultPath)
            if (this.moveMode) {
                this.cancelHover()
                this.updateCursor()
            }
        }
        this.emit(KeyEvent.DOWN, data, this.defaultPath)
    }

    public keyUp(data: IKeyEvent): void {
        if (!this.config.keyEvent) return

        this.emit(KeyEvent.BEFORE_UP, data, this.defaultPath) // 键盘弹起前出发，还没有setUpCode

        const { code } = data
        this.downKeyMap[code] = false
        Keyboard.setUpCode(code)

        this.emit(KeyEvent.UP, data, this.defaultPath)
        if (this.cursor === 'grab') this.updateCursor()
    }


    // helper
    protected pointerHover(data: IPointerEvent): void {
        if (this.canHover && !(this.dragging && !this.p.dragHover)) {
            data.path || (data.path = new LeafList()) // 离开画布的情况
            this.pointerOverOrOut(data)
            this.pointerEnterOrLeave(data)
        }
    }

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

        const hasLong = this.longTap(data)
        if (!pointer.tapMore && hasLong) return // long_press / long_tap

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
        const { hitRadius, through } = this.p
        const { bottomList, target } = this
        if (!Platform.backgrounder && !data.origin) target && target.updateLayout() // 模拟交互
        const find = this.selector.getByPoint(data, hitRadius, { bottomList, name: data.type, ...(options || { through }) })
        if (find.throughPath) data.throughPath = find.throughPath
        data.path = find.path
        return find.path
    }

    public isRootPath(data: IPointerEvent): boolean {
        return data && (data.path.list[0] as ILeaf).isLeafer
    }

    public isTreePath(data: IPointerEvent): boolean {
        const app = this.target.app as IApp
        if (!app || !app.isApp) return false
        return app.editor && (!data.path.has(app.editor) && data.path.has(app.tree) && !(data.target as ILeaf).syncEventer) // 当dragEmpty为true时，在手机端(pointer.hover为false)可以拖动tree层（编辑器选中的元素除外）
    }

    protected checkPath(data: IPointerEvent, useDefaultPath?: boolean): void {
        if (useDefaultPath || (this.moveMode && !pathHasOutside(data.path))) data.path = this.defaultPath
    }

    public canMove(data: IPointerEvent): boolean { // moveMode and path can move
        return data && (this.moveMode || (this.m.drag === 'auto' && !pathCanDrag(data.path))) && !pathHasOutside(data.path)
    }


    public isDrag(leaf: ILeaf): boolean {
        return this.dragger.getList().has(leaf)
    }

    public isPress(leaf: ILeaf): boolean {
        return this.downData && this.downData.path.has(leaf)
    }

    public isHover(leaf: ILeaf): boolean {
        return this.enterPath && this.enterPath.has(leaf)
    }

    public isFocus(leaf: ILeaf): boolean {
        return this.focusData === leaf
    }


    public cancelHover(): void {
        const { hoverData } = this
        if (hoverData) {
            hoverData.path = this.defaultPath
            this.pointerHover(hoverData)
        }
    }

    public stopDragAnimate(): void {
        this.dragger.stopAnimate()
    }


    public updateDownData(data?: IPointerEvent, options?: IPickOptions, merge?: boolean): void {
        const { downData } = this
        if (!data && downData) data = downData
        if (!data) return
        this.findPath(data, options)
        if (merge && downData) data.path.addList(downData.path.list)
        this.downData = data
    }

    public updateHoverData(data?: IPointerEvent): void {
        if (!data) data = this.hoverData
        if (!data) return
        this.findPath(data, { exclude: this.dragger.getList(false, true), name: PointerEvent.MOVE })
        this.hoverData = data
    }

    public updateCursor(data?: IPointerEvent): void {
        if (!this.config.cursor || !this.canHover) return

        if (!data) {
            this.updateHoverData()
            data = this.downData || this.hoverData
        }

        if (this.dragger.moving) {
            return this.setCursor('grabbing')
        } else if (this.canMove(data)) {
            return this.setCursor(this.downData ? 'grabbing' : 'grab')
        } else if (!data) return

        let leaf: ILeaf, cursor: ICursorType | ICursorType[]

        const { path } = data
        for (let i = 0, len = path.length; i < len; i++) {
            leaf = path.list[i]
            cursor = (leaf.syncEventer && leaf.syncEventer.cursor) || leaf.cursor
            if (cursor) break
        }

        this.setCursor(cursor)
    }

    public setCursor(cursor: ICursorType | ICursorType[]): void {
        this.cursor = cursor
    }

    public getLocal(clientPoint: IClientPointData, updateClient?: boolean): IPointData {
        const clientBounds = this.canvas.getClientBounds(updateClient)
        const point = { x: clientPoint.clientX - clientBounds.x, y: clientPoint.clientY - clientBounds.y }

        // 兼容clientBounds进行了transform的情况
        const { bounds } = this.canvas
        point.x *= bounds.width / clientBounds.width
        point.y *= bounds.height / clientBounds.height

        if (this.p.snap) PointHelper.round(point)
        return point
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
        if (this.waitTap) {
            clearTimeout(this.tapTimer)
            this.waitTap = false
            this.tapCount = 0
        }
    }

    protected longPressWait(data: IPointerEvent): void {
        clearTimeout(this.longPressTimer)
        this.longPressTimer = setTimeout(() => {
            this.longPressed = true
            this.emit(PointerEvent.LONG_PRESS, data)
        }, this.p.longPressTime)
    }

    protected longTap(data: IPointerEvent): boolean {
        let hasLong
        if (this.longPressed) {
            this.emit(PointerEvent.LONG_TAP, data)
            if (pathHasEventType(data.path, PointerEvent.LONG_TAP) || pathHasEventType(data.path, PointerEvent.LONG_PRESS)) hasLong = true
        }
        this.longPressWaitCancel()
        return hasLong
    }

    protected longPressWaitCancel(): void {
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer)
            this.longPressed = false
        }
    }

    protected __onResize(): void {
        const { dragOut } = this.m
        this.shrinkCanvasBounds = new Bounds(this.canvas.bounds)
        this.shrinkCanvasBounds.spread(-(isNumber(dragOut) ? dragOut : 2))
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
            if (this.transformer) this.transformer.destroy()
            this.downData = this.overPath = this.enterPath = null
        }
    }

}