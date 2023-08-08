import { IApp, ILeafer, ILeaferCanvas, IRenderer, ILayouter, ISelector, IWatcher, IInteraction, ILeaferConfig, ICanvasManager, IHitCanvasManager, IImageManager, IAutoBounds, IScreenSizeData, IResizeEvent, ILeaf, IEventListenerId, ITransformEventData, ITimer, __Value, IObject, IControl } from '@leafer/interface'
import { AutoBounds, LayoutEvent, ResizeEvent, LeaferEvent, CanvasManager, HitCanvasManager, ImageManager, DataHelper, Creator, Run, Debug, RenderEvent, registerUI, boundsType, canvasSizeAttrs, dataProcessor, Platform, PluginManager } from '@leafer/core'

import { ILeaferInputData, ILeaferData, IFunction } from '@leafer-ui/interface'
import { LeaferTypeCreator } from '@leafer-ui/type'
import { LeaferData } from '@leafer-ui/data'
import { Group } from '@leafer-ui/display'

import { App } from './App'


const debug = Debug.get('Leafer')

@registerUI()
export class Leafer extends Group implements ILeafer {

    public get __tag() { return 'Leafer' }

    @dataProcessor(LeaferData)
    public __: ILeaferData

    @boundsType()
    public pixelRatio: number

    public get isApp(): boolean { return false }

    public parent?: App

    public running: boolean
    public ready: boolean
    public viewReady: boolean
    public get viewLoaded(): boolean { return this.viewReady && !this.watcher.changed && this.imageManager.tasker.isComplete }

    public view: unknown

    //  manager
    public canvas: ILeaferCanvas
    public renderer: IRenderer

    public watcher: IWatcher
    public layouter: ILayouter

    public selector?: ISelector
    public interaction?: IInteraction

    public canvasManager: ICanvasManager
    public hitCanvasManager?: IHitCanvasManager
    public imageManager: IImageManager

    public zoomLayer: ILeaf = this
    public moveLayer: ILeaf = this
    public transformData?: ITransformEventData

    public userConfig: ILeaferConfig
    public config: ILeaferConfig = {
        type: 'design',
        start: true,
        hittable: true,
        smooth: true,
        zoom: {
            min: 0.02,
            max: 256
        },
        move: {
            dragOut: true,
            autoDistance: 2
        }
    }

    public autoLayout?: IAutoBounds

    public __eventIds: IEventListenerId[] = []
    protected __startTimer: ITimer
    protected __controllers: IControl[] = []

    constructor(userConfig?: ILeaferConfig, data?: ILeaferInputData) {
        super(data)
        this.userConfig = userConfig
        if (userConfig && (userConfig.view || userConfig.width)) this.init(userConfig)
    }

    public init(userConfig?: ILeaferConfig, parentApp?: IApp): void {
        if (this.canvas) return

        this.__setLeafer(this)
        if (userConfig) DataHelper.assign(this.config, userConfig)

        let start: boolean
        const { config } = this
        LeaferTypeCreator.run(config.type, this)

        // render / layout
        this.canvas = Creator.canvas(config)
        this.__controllers.push(
            this.renderer = Creator.renderer(this, this.canvas, config),
            this.watcher = Creator.watcher(this, config),
            this.layouter = Creator.layouter(this, config)
        )

        if (this.isApp) this.__setApp()
        this.__checkAutoLayout(config)
        this.view = this.canvas.view

        // interaction / manager
        if (parentApp) {
            this.__bindApp(parentApp)
            start = parentApp.running
        } else {
            this.selector = Creator.selector(this)
            this.__controllers.unshift(this.interaction = Creator.interaction(this, this.canvas, this.selector, config))

            this.canvasManager = new CanvasManager()
            this.hitCanvasManager = new HitCanvasManager()
            this.imageManager = new ImageManager(this, config)

            start = config.start
        }

        this.hittable = config.hittable
        this.fill = config.fill
        this.canvasManager.add(this.canvas)

        this.__listenEvents()

        if (start) this.__startTimer = setTimeout(this.start.bind(this))

        PluginManager.onLeafer(this)
    }

    public start(): void {
        clearTimeout(this.__startTimer)
        if (!this.running && this.canvas) {
            this.ready ? this.emitLeafer(LeaferEvent.RESTART) : this.emitLeafer(LeaferEvent.START)
            this.__controllers.forEach(item => item.start())
            if (!this.isApp) this.renderer.render()
            this.running = true
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

    public resize(size: IScreenSizeData): void {
        const data = DataHelper.copyAttrs({}, size, canvasSizeAttrs)
        Object.keys(data).forEach(key => (this as any)[key] = data[key])
    }

    public forceLayout(): void {
        this.__layout.checkUpdate(true)
    }

    public forceFullRender(): void {
        this.renderer.addBlock(this.canvas.bounds)
        if (this.viewReady) this.renderer.update()
    }

    protected __doResize(size: IScreenSizeData): void {
        if (!this.canvas || this.canvas.isSameSize(size)) return
        const old = DataHelper.copyAttrs({}, this.canvas, canvasSizeAttrs) as IScreenSizeData
        this.canvas.resize(size)
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
        this.imageManager = app.imageManager
    }

    public __setLeafer(leafer: ILeafer): void {
        this.leafer = leafer
        this.isLeafer = !!leafer
        this.__level = 1
    }

    public setZoomLayer(zoomLayer: ILeaf, moveLayer?: ILeaf): void {
        this.zoomLayer = zoomLayer
        this.moveLayer = moveLayer || zoomLayer
    }

    public waitViewLoaded(fun: IFunction): void {
        let id: IEventListenerId
        const check = () => {
            if (this.viewLoaded) {
                if (id) this.off_(id)
                Platform.requestRender(fun)
            }
        }
        if (!this.running) this.start()
        check()
        if (!this.viewLoaded) id = this.on_(RenderEvent.AFTER, check)
    }

    protected __checkAutoLayout(config: ILeaferConfig): void {
        if (!config.width || !config.height) {
            this.autoLayout = new AutoBounds(config)
            this.canvas.startAutoLayout(this.autoLayout, this.__onResize.bind(this))
        }
    }

    public __setAttr(attrName: string, newValue: __Value): void {
        if (this.canvas) {
            if (canvasSizeAttrs.includes(attrName)) {
                this.__changeCanvasSize(attrName, newValue as number)
            } else if (attrName === 'fill') {
                this.__changeFill(newValue as string)
            } else if (attrName === 'hittable') {
                this.canvas.hittable = newValue as boolean
            }
        }
        super.__setAttr(attrName, newValue)
    }

    public __getAttr(attrName: string): __Value {
        if (this.canvas && canvasSizeAttrs.includes(attrName)) return this.canvas[attrName]
        return super.__getAttr(attrName)
    }

    protected __changeCanvasSize(attrName: string, newValue: number): void {
        const data = DataHelper.copyAttrs({}, this.canvas, canvasSizeAttrs)
        data[attrName] = (this.config as IObject)[attrName] = newValue
        if (newValue) this.canvas.stopAutoLayout()
        this.__doResize(data as IScreenSizeData)
    }

    protected __changeFill(newValue: string): void {
        this.config.fill = newValue as string
        if (this.canvas.allowBackgroundColor) {
            this.canvas.backgroundColor = newValue as string
        } else {
            this.forceFullRender()
        }
    }

    protected __onReady(): void {
        if (this.ready) return
        this.ready = true
        this.emitLeafer(LeaferEvent.BEFORE_READY)
        this.emitLeafer(LeaferEvent.READY)
        this.emitLeafer(LeaferEvent.AFTER_READY)
    }

    protected __onViewReady(): void {
        if (this.viewReady) return
        this.viewReady = true
        this.emitLeafer(LeaferEvent.VIEW_READY)
    }

    protected __checkUpdateLayout(): void {
        this.__layout.checkUpdate()
    }

    protected emitLeafer(type: string): void {
        this.emitEvent(new LeaferEvent(type, this))
    }

    protected __listenEvents(): void {
        const runId = Run.start('FirstCreate ' + this.innerName)
        this.once(LeaferEvent.START, () => Run.end(runId))
        this.once(LayoutEvent.END, () => this.__onReady())
        this.once(RenderEvent.END, () => this.__onViewReady())
        this.on(LayoutEvent.CHECK_UPDATE, () => this.__checkUpdateLayout())
    }

    protected __removeListenEvents(): void {
        this.off_(this.__eventIds)
    }

    public destroy(): void {
        if (this.canvas) {
            try {
                this.stop()
                this.emitEvent(new LeaferEvent(LeaferEvent.END, this))
                this.__removeListenEvents()

                this.__controllers.forEach(item => item.destroy())
                this.__controllers.length = 0

                this.selector.destroy()
                this.canvasManager.destroy()
                this.hitCanvasManager.destroy()
                this.imageManager.destroy()

                this.canvas.destroy()
                this.canvas = null

                this.config = this.userConfig = this.view = null

                super.destroy()
            } catch (e) {
                debug.error(e)
            }
        }
    }
}
