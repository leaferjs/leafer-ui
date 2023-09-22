import { IApp, ILeafer, ILeaferCanvas, IRenderer, ILayouter, ISelector, IWatcher, IInteraction, ILeaferConfig, ICanvasManager, IHitCanvasManager, IAutoBounds, IScreenSizeData, IResizeEvent, ILeaf, IEventListenerId, ITransformEventData, ITimer, __Value, IObject, IControl } from '@leafer/interface'
import { AutoBounds, LayoutEvent, ResizeEvent, LeaferEvent, CanvasManager, HitCanvasManager, ImageManager, DataHelper, Creator, Run, Debug, RenderEvent, registerUI, boundsType, canvasSizeAttrs, dataProcessor, PluginManager, WaitHelper, WatchEvent } from '@leafer/core'

import { ILeaferInputData, ILeaferData, IFunction, IUIInputData } from '@leafer-ui/interface'
import { LeaferTypeCreator } from '@leafer-ui/type'
import { LeaferData } from '@leafer-ui/data'
import { Group } from '@leafer-ui/display'

import { App } from './App'


const debug = Debug.get('Leafer')

@registerUI()
export class Leafer extends Group implements ILeafer {

    public get __tag() { return 'Leafer' }

    @dataProcessor(LeaferData)
    declare public __: ILeaferData

    @boundsType()
    public pixelRatio: number

    public get isApp(): boolean { return false }
    public get app(): ILeafer { return this.parent || this }

    declare public parent?: App

    public running: boolean
    public created: boolean
    public ready: boolean
    public viewReady: boolean
    public viewCompleted: boolean

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
            holdSpaceKey: true,
            dragOut: true,
            autoDistance: 2
        }
    }

    public autoLayout?: IAutoBounds

    public __eventIds: IEventListenerId[] = []
    protected __startTimer: ITimer
    protected __controllers: IControl[] = []

    protected __readyWait: IFunction[] = []
    protected __viewReadyWait: IFunction[] = []
    protected __viewCompletedWait: IFunction[] = []
    public __nextRenderWait: IFunction[] = []

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

            start = config.start
        }

        this.hittable = config.hittable
        this.fill = config.fill
        this.canvasManager.add(this.canvas)

        this.__listenEvents()

        if (start) this.__startTimer = setTimeout(this.start.bind(this))

        PluginManager.onLeafer(this)
    }

    public set(data: IUIInputData): void {
        if (!this.children) {
            setTimeout(() => {
                super.set(data)
            })
        } else {
            super.set(data)
        }
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

    public updateCursor(): void {
        if (this.interaction) this.interaction.updateCursor()
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

    protected __onCreated(): void {
        this.created = true
    }

    protected __onReady(): void {
        if (this.ready) return
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

    protected __onRenderEnd(_e: RenderEvent): void {
        if (!this.viewReady) this.__onViewReady()
        const completed = this.__checkViewCompleted()
        if (completed) this.__onViewCompleted()
        this.viewCompleted = completed
        WaitHelper.run(this.__nextRenderWait)
    }

    protected __checkViewCompleted(): boolean {
        return this.viewReady && !this.watcher.changed && ImageManager.isComplete
    }

    protected __onViewCompleted(): void {
        if (!this.viewCompleted) {
            this.emitLeafer(LeaferEvent.VIEW_COMPLETED)
            WaitHelper.run(this.__viewCompletedWait)
        }
    }

    protected __onWatchData(): void {
        if (this.watcher.childrenChanged && this.interaction) {
            this.nextRender(() => this.interaction.updateCursor())
        }
    }

    public waitReady(item: IFunction): void {
        this.ready ? item() : this.__readyWait.push(item)
    }

    public waitViewReady(item: IFunction): void {
        this.viewReady ? item() : this.__viewReadyWait.push(item)
    }

    public waitViewCompleted(item: IFunction): void {
        if (this.viewCompleted) {
            item()
        } else {
            this.__viewCompletedWait.push(item)
            if (!this.running) this.start()
        }
    }

    public nextRender(item: IFunction): void {
        if (this.watcher && !this.watcher.changed) {
            item()
        } else {
            this.__nextRenderWait.push(item)
        }
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
        this.once(RenderEvent.START, () => this.__onCreated())
        this.__eventIds.push(
            this.on_(WatchEvent.DATA, this.__onWatchData, this),
            this.on_(RenderEvent.END, this.__onRenderEnd, this),
            this.on_(LayoutEvent.CHECK_UPDATE, this.__checkUpdateLayout, this)
        )
    }

    protected __removeListenEvents(): void {
        this.off_(this.__eventIds)
        this.__eventIds.length = 0
    }

    public destroy(): void {
        setTimeout(() => {
            if (!this.destroyed) {
                try {
                    this.stop()
                    this.emitEvent(new LeaferEvent(LeaferEvent.END, this))
                    this.__removeListenEvents()

                    this.__controllers.forEach(item => {
                        if (!(this.parent && item === this.interaction)) item.destroy()
                    })
                    this.__controllers.length = 0

                    if (!this.parent) {
                        this.selector.destroy()
                        this.canvasManager.destroy()
                        this.hitCanvasManager.destroy()
                    }

                    this.canvas.destroy()

                    this.config.view = this.view = null
                    if (this.userConfig) this.userConfig.view = null

                    super.destroy()

                    setTimeout(() => { ImageManager.clearRecycled() }, 100)
                } catch (e) {
                    debug.error(e)
                }
            }
        })

    }
}
