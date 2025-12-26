import { ILeaferCanvas, IRenderer, ILayouter, ISelector, IWatcher, IInteraction, ILeaferConfig, ICanvasManager, IHitCanvasManager, IAutoBounds, IScreenSizeData, IResizeEvent, IEventListenerId, ITimer, IValue, IObject, IControl, IPointData, ILeaferType, ICursorType, IBoundsData, INumber, IZoomType, IZoomOptions, IFourNumber, IBounds, IClientPointData, ITransition, ICanvasSizeAttr, ILeaferMode } from '@leafer/interface'
import { AutoBounds, LayoutEvent, ResizeEvent, LeaferEvent, CanvasManager, ImageManager, Resource, DataHelper, Creator, Run, Debug, RenderEvent, registerUI, boundsType, canvasSizeAttrs, dataProcessor, WaitHelper, WatchEvent, Bounds, LeafList, Plugin, getBoundsData, dataType } from '@leafer/core'

import { ILeaferInputData, ILeaferData, IFunction, IUIInputData, ILeafer, IApp, IEditorBase } from '@leafer-ui/interface'
import { LeaferData } from '@leafer-ui/data'

import { Group } from './Group'


const debug = Debug.get('Leafer')

@registerUI()
export class Leafer extends Group implements ILeafer {

    static list = new LeafList() // 所有leafer实例


    public get __tag() { return 'Leafer' }

    @dataProcessor(LeaferData)
    declare public __: ILeaferData

    @boundsType()
    declare public pixelRatio?: INumber

    @dataType('normal')
    public mode: ILeaferMode

    public get isApp(): boolean { return false }
    public get app(): ILeafer { return this.parent || this }

    public get isLeafer(): boolean { return true }

    public parentApp?: IApp
    declare public parent?: IApp

    public running: boolean
    public created: boolean
    public ready: boolean
    public viewReady: boolean
    public viewCompleted: boolean
    public get imageReady(): boolean { return this.viewReady && Resource.isComplete }
    public get layoutLocked() { return !this.layouter.running }

    public transforming: boolean

    public get view(): unknown { return this.canvas && this.canvas.view }

    //  manager
    public canvas: ILeaferCanvas
    public renderer: IRenderer

    public watcher: IWatcher
    public layouter: ILayouter

    public selector?: ISelector
    public interaction?: IInteraction

    public canvasManager: ICanvasManager
    public hitCanvasManager?: IHitCanvasManager

    // plugin
    public editor: IEditorBase

    public userConfig: ILeaferConfig
    public config: ILeaferConfig = {
        start: true,
        hittable: true,
        smooth: true,
        lazySpeard: 100,
        // maxFPS: 120, // 最大的运行帧率
        // pixelSnap: false // 是否对齐像素，避免图片存在浮点坐标导致模糊
    }

    public autoLayout?: IAutoBounds
    public lazyBounds: IBounds

    public get FPS(): number { return this.renderer ? this.renderer.FPS : 60 }
    public get cursorPoint(): IPointData { return (this.interaction && this.interaction.hoverData) || { x: this.width / 2, y: this.height / 2 } }
    public get clientBounds(): IBoundsData { return (this.canvas && this.canvas.getClientBounds(true)) || getBoundsData() }
    public leafs = 0

    public __eventIds: IEventListenerId[] = []
    protected __startTimer: ITimer
    protected __controllers: IControl[] = []

    protected __initWait: IFunction[] // assign in waitInit()
    protected __readyWait: IFunction[] = []
    protected __viewReadyWait: IFunction[] = []
    protected __viewCompletedWait: IFunction[] = []
    public __nextRenderWait: IFunction[] = []

    constructor(userConfig?: ILeaferConfig, data?: ILeaferInputData) {
        super(data)
        this.userConfig = userConfig
        if (userConfig && (userConfig.view || userConfig.width)) this.init(userConfig)
        Leafer.list.add(this)
    }

    public init(userConfig?: ILeaferConfig, parentApp?: IApp): void {
        if (this.canvas) return

        let start: boolean
        const { config } = this

        this.__setLeafer(this)

        if (parentApp) {
            this.parentApp = parentApp
            this.__bindApp(parentApp)
            start = parentApp.running
        }

        if (userConfig) {
            this.parent = parentApp
            this.initType(userConfig.type) // LeaferType
            this.parent = undefined
            DataHelper.assign(config, userConfig)
        }

        // render / layout
        const canvas = this.canvas = Creator.canvas(config)
        this.__controllers.push(
            this.renderer = Creator.renderer(this, canvas, config),
            this.watcher = Creator.watcher(this, config),
            this.layouter = Creator.layouter(this, config)
        )

        if (this.isApp) this.__setApp()
        this.__checkAutoLayout()

        // interaction / manager
        if (!parentApp) {
            this.selector = Creator.selector(this)
            this.interaction = Creator.interaction(this, canvas, this.selector, config)

            if (this.interaction) {
                this.__controllers.unshift(this.interaction)
                this.hitCanvasManager = Creator.hitCanvasManager()
            }

            this.canvasManager = new CanvasManager()

            start = config.start
        }

        this.hittable = config.hittable
        this.fill = config.fill
        this.canvasManager.add(canvas)


        this.__listenEvents()

        if (start) this.__startTimer = setTimeout(this.start.bind(this))

        WaitHelper.run(this.__initWait)
        this.onInit() // can rewrite init event
    }

    public onInit(): void { }

    public initType(_type: ILeaferType): void { } // rewrite in @leafer-ui/viewport

    public set(data: IUIInputData, transition?: ITransition | 'temp'): void {
        this.waitInit(() => { super.set(data, transition) })
    }

    public start(): void {
        clearTimeout(this.__startTimer)
        if (!this.running && this.canvas) {
            this.running = true
            this.ready ? this.emitLeafer(LeaferEvent.RESTART) : this.emitLeafer(LeaferEvent.START)
            this.__controllers.forEach(item => item.start())
            if (!this.isApp) this.renderer.render()
        }
    }

    public stop(): void {
        clearTimeout(this.__startTimer)
        if (this.running && this.canvas) {
            this.__controllers.forEach(item => item.stop())
            this.running = false
            this.emitLeafer(LeaferEvent.STOP)
        }
    }

    public unlockLayout(): void {
        this.layouter.start()
        this.updateLayout()
    }

    public lockLayout(): void {
        this.updateLayout()
        this.layouter.stop()
    }

    public resize(size: IScreenSizeData): void {
        const data = DataHelper.copyAttrs({}, size, canvasSizeAttrs)
        Object.keys(data).forEach(key => (this as any)[key] = data[key])
    }

    override forceRender(bounds?: IBoundsData, sync?: boolean): void {
        const { renderer } = this
        if (renderer) {
            renderer.addBlock(bounds ? new Bounds(bounds) : this.canvas.bounds)
            if (this.viewReady) sync ? renderer.render() : renderer.update()
        }
    }

    public requestRender(change = false): void {
        if (this.renderer) this.renderer.update(change)
    }

    public updateCursor(cursor?: ICursorType): void {
        const i = this.interaction
        if (i) cursor ? i.setCursor(cursor) : i.updateCursor()
    }

    public updateLazyBounds(): void {
        this.lazyBounds = this.canvas.bounds.clone().spread(this.config.lazySpeard)
    }

    protected __doResize(size: IScreenSizeData): void {
        const { canvas } = this
        if (!canvas || canvas.isSameSize(size)) return
        const old = DataHelper.copyAttrs({}, this.canvas, canvasSizeAttrs) as IScreenSizeData
        canvas.resize(size)
        this.updateLazyBounds()
        this.__onResize(new ResizeEvent(size, old))
    }

    protected __onResize(event: IResizeEvent): void {
        this.emitEvent(event)
        DataHelper.copyAttrs(this.__, event, canvasSizeAttrs)
        setTimeout(() => { if (this.canvasManager) this.canvasManager.clearRecycled() }, 0)
    }

    protected __setApp(): void { }

    protected __bindApp(app: IApp): void {
        this.selector = app.selector
        this.interaction = app.interaction

        this.canvasManager = app.canvasManager
        this.hitCanvasManager = app.hitCanvasManager
    }

    public __setLeafer(leafer: ILeafer): void {
        this.leafer = leafer
        this.__level = 1
    }

    protected __checkAutoLayout(): void {
        const { config, parentApp } = this
        if (!parentApp) {
            if (!config.width || !config.height) this.autoLayout = new AutoBounds(config)
            this.canvas.startAutoLayout(this.autoLayout, this.__onResize.bind(this))
        }
    }

    override __setAttr(attrName: string, newValue: IValue): boolean {
        if (this.canvas) {
            if (canvasSizeAttrs.includes(attrName)) {
                // if (!newValue) debug.warn(attrName + ' is 0')
                this.__changeCanvasSize(attrName as ICanvasSizeAttr, newValue as number)
            } else if (attrName === 'fill') {
                this.__changeFill(newValue as string)
            } else if (attrName === 'hittable') {
                if (!this.parent) this.canvas.hittable = newValue as boolean
            } else if (attrName === 'zIndex') {
                this.canvas.zIndex = newValue as any
                setTimeout(() => this.parent && this.parent.__updateSortChildren())
            } else if (attrName === 'mode') this.emit(LeaferEvent.UPDATE_MODE, { mode: newValue })
        }
        return super.__setAttr(attrName, newValue)
    }

    override __getAttr(attrName: string): IValue {
        if (this.canvas && canvasSizeAttrs.includes(attrName)) return this.canvas[attrName]
        return super.__getAttr(attrName)
    }

    protected __changeCanvasSize(attrName: ICanvasSizeAttr, newValue: number): void {
        const { config, canvas } = this
        const data = DataHelper.copyAttrs({}, canvas, canvasSizeAttrs)
        data[attrName] = config[attrName] = newValue
        config.width && config.height ? canvas.stopAutoLayout() : this.__checkAutoLayout()
        this.__doResize(data as IScreenSizeData)
    }

    protected __changeFill(newValue: string): void {
        this.config.fill = newValue as string
        if (this.canvas.allowBackgroundColor) this.canvas.backgroundColor = newValue as string
        else this.forceRender()
    }

    protected __onCreated(): void {
        this.created = true
    }

    protected __onReady(): void {
        this.ready = true
        this.emitLeafer(LeaferEvent.BEFORE_READY)
        this.emitLeafer(LeaferEvent.READY)
        this.emitLeafer(LeaferEvent.AFTER_READY)
        WaitHelper.run(this.__readyWait)
    }

    protected __onViewReady(): void {
        if (this.viewReady) return
        this.viewReady = true
        this.emitLeafer(LeaferEvent.VIEW_READY)
        WaitHelper.run(this.__viewReadyWait)
    }

    protected __onLayoutEnd(): void {
        const { grow, width: fixedWidth, height: fixedHeight } = this.config
        if (grow) {
            let { width, height, pixelRatio } = this
            const bounds = grow === 'box' ? this.worldBoxBounds : this.__world
            if (!fixedWidth) width = Math.max(1, bounds.x + bounds.width)
            if (!fixedHeight) height = Math.max(1, bounds.y + bounds.height)
            this.__doResize({ width, height, pixelRatio })
        }

        if (!this.ready) this.__onReady()
    }

    protected __onNextRender(): void {
        if (this.viewReady) {
            WaitHelper.run(this.__nextRenderWait)

            const { imageReady } = this
            if (imageReady && !this.viewCompleted) this.__checkViewCompleted()
            if (!imageReady) {
                this.viewCompleted = false
                this.requestRender()
            }
        } else this.requestRender() // fix: 小程序等需要异步获取 view 的情况
    }

    protected __checkViewCompleted(emit: boolean = true): void {
        this.nextRender(() => {
            if (this.imageReady) {
                if (emit) this.emitLeafer(LeaferEvent.VIEW_COMPLETED)
                WaitHelper.run(this.__viewCompletedWait)
                this.viewCompleted = true
            }
        })
    }

    protected __onWatchData(): void {
        if (this.watcher.childrenChanged && this.interaction) {
            this.nextRender(() => this.interaction.updateCursor())
        }
    }

    public waitInit(item: IFunction, bind?: IObject): void {
        if (bind) item = item.bind(bind)
        if (!this.__initWait) this.__initWait = [] // set() use
        this.canvas ? item() : this.__initWait.push(item)
    }

    public waitReady(item: IFunction, bind?: IObject): void {
        if (bind) item = item.bind(bind)
        this.ready ? item() : this.__readyWait.push(item)
    }

    public waitViewReady(item: IFunction, bind?: IObject): void {
        if (bind) item = item.bind(bind)
        this.viewReady ? item() : this.__viewReadyWait.push(item)
    }

    public waitViewCompleted(item: IFunction, bind?: IObject): void {
        if (bind) item = item.bind(bind)
        this.__viewCompletedWait.push(item)
        if (this.viewCompleted) this.__checkViewCompleted(false)
        else if (!this.running) this.start()
    }

    public nextRender(item: IFunction, bind?: IObject, off?: 'off'): void {
        if (bind) item = item.bind(bind)
        const list = this.__nextRenderWait
        if (off) {
            for (let i = 0; i < list.length; i++) {
                if (list[i] === item) { list.splice(i, 1); break }
            }
        } else list.push(item)
        this.requestRender()
    }

    // need view plugin
    public zoom(_zoomType: IZoomType, _optionsOrPadding?: IZoomOptions | IFourNumber, _scroll?: 'x' | 'y' | boolean, _transition?: ITransition): IBoundsData {
        return Plugin.need('view')
    }


    // interaction window rewrite
    public getValidMove(moveX: number, moveY: number, _checkLimit?: boolean): IPointData { return { x: moveX, y: moveY } }
    public getValidScale(changeScale: number): number { return changeScale }


    public getWorldPointByClient(clientPoint: IClientPointData, updateClient?: boolean): IPointData {
        return this.interaction && this.interaction.getLocal(clientPoint, updateClient)
    }

    public getPagePointByClient(clientPoint: IClientPointData, updateClient?: boolean): IPointData {
        return this.getPagePoint(this.getWorldPointByClient(clientPoint, updateClient))
    }

    public getClientPointByWorld(worldPoint: IPointData): IPointData {
        const { x, y } = this.clientBounds
        return { x: x + worldPoint.x, y: y + worldPoint.y }
    }

    public updateClientBounds(): void {
        this.canvas && this.canvas.updateClientBounds()
    }

    // miniapp rewrite
    public receiveEvent(_event: any): void { }

    protected emitLeafer(type: string): void {
        this.emitEvent(new LeaferEvent(type, this))
    }

    protected __listenEvents(): void {
        const runId = Run.start('FirstCreate ' + this.innerName)
        this.once([
            [LeaferEvent.START, () => Run.end(runId)],
            [LayoutEvent.START, this.updateLazyBounds, this],
            [RenderEvent.START, this.__onCreated, this],
            [RenderEvent.END, this.__onViewReady, this]
        ])
        this.__eventIds.push(
            this.on_([
                [WatchEvent.DATA, this.__onWatchData, this],
                [LayoutEvent.END, this.__onLayoutEnd, this],
                [RenderEvent.NEXT, this.__onNextRender, this]
            ])
        )
    }

    protected __removeListenEvents(): void {
        this.off_(this.__eventIds)
    }

    override destroy(sync?: boolean): void {
        const doDestory = () => {
            if (!this.destroyed) {
                Leafer.list.remove(this)
                try {
                    this.stop()
                    this.emitLeafer(LeaferEvent.END)
                    this.__removeListenEvents()

                    this.__controllers.forEach(item => !(this.parent && item === this.interaction) && item.destroy())
                    this.__controllers.length = 0

                    if (!this.parent) {
                        if (this.selector) this.selector.destroy()
                        if (this.hitCanvasManager) this.hitCanvasManager.destroy()
                        if (this.canvasManager) this.canvasManager.destroy()
                    }

                    if (this.canvas) this.canvas.destroy()

                    this.config.view = this.parentApp = null
                    if (this.userConfig) this.userConfig.view = null

                    super.destroy()

                    setTimeout(() => { ImageManager.clearRecycled() }, 100)
                } catch (e) {
                    debug.error(e)
                }
            }
        }
        sync ? doDestory() : setTimeout(doDestory)
    }
}
