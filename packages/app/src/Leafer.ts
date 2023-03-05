import { ILayouter, ILeafer, ILeaferCanvas, IRenderer, ICreator, ISelector, IWatcher, IInteraction, ILeaferConfig, ICanvasManager, IHitCanvasManager, IImageManager, IAutoBounds, IScreenSizeData, IResizeEvent, IObject, ILeaf, IEventListenerId, ITransformEventData } from '@leafer/interface'
import { registerUI, AutoBounds, LayoutEvent, ResizeEvent, MoveEvent, ZoomEvent, CanvasManager, HitCanvasManager, ImageManager, DataHelper, LeafHelper, Creator } from '@leafer/core'

import { Group } from '@leafer-ui/display'

import { SuperLeafer } from './SuperLeafer'


@registerUI()
export class Leafer extends Group implements ILeafer {

    public creator: ICreator

    public get isSupperLeafer(): boolean { return false }

    public parent?: SuperLeafer

    public running: boolean

    @resizeType()
    public width: number

    @resizeType()
    public height: number

    @resizeType()
    public pixelRatio: number

    public config: ILeaferConfig = {
        zoom: true,
        move: true,
        start: true,
        pixelRatio: devicePixelRatio
    }

    public autoLayout?: IAutoBounds

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

    public zoomLayer?: ILeaf
    public moveLayer?: ILeaf
    public transformData?: ITransformEventData

    protected __eventIds: IEventListenerId[] = []

    constructor(userConfig?: ILeaferConfig, parentLeafer?: ILeafer) {
        super()

        this.creator = Creator

        const { config } = this

        this.__setAsLeafer()
        this.__setConfig(userConfig)

        // render
        this.canvas = Creator.canvas(config)
        this.renderer = Creator.renderer(this, this.canvas, config)

        // layout
        if (this.isSupperLeafer) {
            this.__level = 1
        } else {

            this.watcher = Creator.watcher(this)
            this.layouter = Creator.layouter(this)

        }

        this.__checkAutoLayout(config)

        // interaction / manager
        if (parentLeafer) {

            parentLeafer.selector?.defaultPath.unshift(this)

            this.selector = parentLeafer.selector
            this.interaction = parentLeafer.interaction

            this.canvasManager = parentLeafer.canvasManager
            this.hitCanvasManager = parentLeafer.hitCanvasManager
            this.imageManager = parentLeafer.imageManager

            if (parentLeafer.running) setTimeout(this.start.bind(this))

        } else {

            this.selector = Creator.selector(this)
            this.interaction = Creator.interaction(this, this.canvas, this.selector, config)

            this.canvasManager = new CanvasManager(this)
            this.hitCanvasManager = new HitCanvasManager(this)
            this.imageManager = new ImageManager(this, config)

            if (config.start) setTimeout(this.start.bind(this))

        }

        this.canvasManager.add(this.canvas)
        this.__listenEvents()

    }

    protected __listenEvents(): void {
        this.once(LayoutEvent.END, this.__setAsRoot.bind(this))
    }

    protected __removeListenEvents(): void {
        this.off__(this.__eventIds)
    }

    protected __setConfig(userConfig?: ILeaferConfig): void {
        if (userConfig) this.config = DataHelper.default(userConfig, this.config)
    }

    protected __checkAutoLayout(config: ILeaferConfig): void {
        if (!config.width || !config.height) {
            this.autoLayout = new AutoBounds(config)
            this.canvas.autoLayout(this.autoLayout, this.__onResize.bind(this))
        }
    }

    public start(): void {
        if (!this.running) {
            this.__interactiveWindow()
            this.interaction?.start()
            this.renderer.start()
            this.layouter.start()
            this.watcher.start()
            this.running = true
        }
    }

    public stop(): void {
        if (this.running) {
            this.interaction?.stop()
            this.watcher.stop()
            this.layouter.stop()
            this.renderer.stop()
            this.running = false
        }
    }

    protected __interactiveWindow(): void {
        const { zoom, move } = this.config
        if (move) {
            const { MOVE } = MoveEvent
            const { ZOOM } = ZoomEvent
            if (!this.hasEvent(MOVE)) this.__eventIds.push(this.on__(MOVE, (e: MoveEvent) => { LeafHelper.moveByWorld(this, e.moveX, e.moveY) }))
            if (zoom && !this.hasEvent(ZOOM)) this.__eventIds.push(this.on__(ZOOM, (e: ZoomEvent) => { LeafHelper.zoomByWorld(this, e.scale, e) }))
        }
    }

    public resize(size: IScreenSizeData): void {
        if (this.canvas.isSameSize(size)) return
        const { width, height, pixelRatio } = this.canvas
        const oldSize = { width, height, pixelRatio }
        this.canvas.resize(size)
        this.__onResize(new ResizeEvent(size, oldSize))
    }

    protected __onResize(event: IResizeEvent): void {
        this.emitEvent(event)
        setTimeout(() => { this.canvasManager.clearRecycled() }, 0)
    }

    public destory(): void {
        if (this.canvas) {
            super.destroy()

            this.__removeListenEvents()

            if (!this.parent) {
                this.interaction?.destroy()
                this.selector.destroy()

                this.renderer.destroy()
                this.watcher.destroy()
                this.layouter.destroy()

                this.canvasManager.destory()
                this.hitCanvasManager.destory()
                this.imageManager.destory()
            }

            this.canvas.destroy()
            this.canvas = undefined

            this.creator = undefined
            this.config = undefined

            this.interaction = undefined
            this.selector = undefined


            this.renderer = undefined
            this.watcher = undefined
            this.layouter = undefined

            this.canvasManager = undefined
            this.hitCanvasManager = undefined
            this.imageManager = undefined

            this.zoomLayer = undefined
            this.moveLayer = undefined

            this.parent = undefined
        }
    }
}

function resizeType() {
    return (target: Leafer, key: string) => {
        const property: IObject & ThisType<Leafer> = {
            get() {
                return (this.canvas as IObject)[key]
            },
            set(value: number) {
                const { width, height, pixelRatio } = this.canvas
                const data = { width, height, pixelRatio } as IObject
                data[key] = value
                this.resize(data as IScreenSizeData)
            }
        }
        Object.defineProperty(target, key, property)
    }
}
