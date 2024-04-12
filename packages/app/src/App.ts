import { ILeaferConfig, IResizeEvent, ILeaferCanvas, IRenderOptions, ILeaferBase, IBoundsData } from '@leafer/interface'
import { Creator, DataHelper, Debug, LayoutEvent, PropertyEvent, RenderEvent, canvasSizeAttrs, registerUI } from '@leafer/core'

import { IApp, IAppConfig, IAppInputData, IEditorBase, ILeafer } from '@leafer-ui/interface'

import { Leafer } from '@leafer-ui/draw'


@registerUI()
export class App extends Leafer implements IApp {

    public get __tag() { return 'App' }

    public get isApp(): boolean { return true }

    declare public children: ILeafer[]

    public realCanvas: boolean

    public ground: ILeafer
    public tree: ILeafer
    public sky: ILeafer

    constructor(userConfig?: IAppConfig, data?: IAppInputData) {
        super(userConfig, data)
    }

    public init(userConfig?: IAppConfig, parentApp?: IApp): void {
        super.init(userConfig, parentApp)
        if (userConfig) {
            const { ground, tree, sky, editor } = userConfig
            if (ground) this.ground = this.addLeafer(ground)
            if (tree || editor) this.tree = this.addLeafer(tree)
            if (sky || editor) this.sky = this.addLeafer(sky || { type: 'draw', usePartRender: false })
            if (editor) {
                this.editor = Creator.editor(editor) as IEditorBase
                this.sky.add(this.editor)
            }
        }
    }

    protected __setApp(): void {
        const { canvas } = this
        const { realCanvas, view } = this.config
        if (realCanvas || view === this.canvas.view || !canvas.parentView) {
            this.realCanvas = true
        } else {
            canvas.unrealCanvas()
        }

        this.leafer = this
        this.watcher.disable()
        this.layouter.disable()

        this.__eventIds.push(this.on_(PropertyEvent.CHANGE, this.__onPropertyChange, this))
    }

    public start(): void {
        super.start()
        this.children.forEach(leafer => leafer.start())
    }

    public stop(): void {
        this.children.forEach(leafer => leafer.stop())
        super.stop()
    }

    public unlockLayout(): void {
        super.unlockLayout()
        this.children.forEach(leafer => leafer.unlockLayout())
    }

    public lockLayout(): void {
        super.lockLayout()
        this.children.forEach(leafer => leafer.lockLayout())
    }

    public forceRender(bounds?: IBoundsData): void {
        this.children.forEach(leafer => leafer.forceRender(bounds))
    }

    public addLeafer(merge?: ILeaferConfig): Leafer {
        const leafer = new Leafer(merge)
        this.add(leafer)
        return leafer
    }

    public add(leafer: ILeafer): void {
        if (!leafer.view) {
            if (this.realCanvas && !this.canvas.bounds) { // wait miniapp select canvas
                setTimeout(() => this.add(leafer), 10)
                return
            }
            leafer.init(this.__getChildConfig(leafer.userConfig), this)
        }

        super.add(leafer)
        this.__listenChildEvents(leafer)
    }

    protected __onPropertyChange(): void {
        if (Debug.showHitView) this.children.forEach(leafer => leafer.forceUpdate('surface'))
    }

    protected __onCreated(): void {
        this.created = this.children.every(child => child.created)
    }

    protected __onReady(): void {
        if (this.children.every(child => child.ready)) super.__onReady()
    }

    protected __onViewReady(): void {
        if (this.children.every(child => child.viewReady)) super.__onViewReady()
    }

    protected __onChildRenderEnd(e: RenderEvent): void {
        this.renderer.addBlock(e.renderBounds)
        if (this.viewReady) this.renderer.update()
    }

    public __render(canvas: ILeaferCanvas, options: IRenderOptions): void {
        canvas.setWorld(options.matrix || this.__world)
        this.children.forEach(leafer => canvas.copyWorld(leafer.canvas))
    }

    public __onResize(event: IResizeEvent): void {
        this.children.forEach(leafer => leafer.resize(event))
        super.__onResize(event)
    }

    protected __checkUpdateLayout(): void {
        this.children.forEach(leafer => leafer.__layout.update())
    }

    protected __getChildConfig(userConfig?: ILeaferConfig): ILeaferConfig {
        let config = { ...this.config }
        config.hittable = config.realCanvas = undefined
        if (userConfig) DataHelper.assign(config, userConfig)

        // reset
        if (this.autoLayout) DataHelper.copyAttrs(config, this, canvasSizeAttrs)
        config.view = this.realCanvas ? undefined : this.view
        config.fill = undefined
        return config
    }

    protected __listenChildEvents(leafer: ILeaferBase): void {
        leafer.once(LayoutEvent.END, () => this.__onReady())
        leafer.once(RenderEvent.START, () => this.__onCreated())
        leafer.once(RenderEvent.END, () => this.__onViewReady())
        if (this.realCanvas) this.__eventIds.push(leafer.on_(RenderEvent.END, this.__onChildRenderEnd, this))
    }

}