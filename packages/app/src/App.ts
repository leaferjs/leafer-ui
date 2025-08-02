import { ILeaferConfig, IResizeEvent, ILeaferCanvas, IRenderOptions, ILeaferBase, IBoundsData } from '@leafer/interface'
import { Creator, DataHelper, LayoutEvent, RenderEvent, canvasSizeAttrs, registerUI, isUndefined } from '@leafer/core'

import { IApp, IAppConfig, IAppForEachFunction, IAppInputData, ILeafer } from '@leafer-ui/interface'

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

    override init(userConfig?: IAppConfig, parentApp?: IApp): void {
        super.init(userConfig, parentApp)
        if (userConfig) {
            const { ground, tree, sky, editor } = userConfig
            if (ground) this.ground = this.addLeafer(ground)
            if (tree || editor) this.tree = this.addLeafer(tree || { type: userConfig.type || 'design' })
            if (sky || editor) this.sky = this.addLeafer(sky)
            if (editor) Creator.editor(editor, this)
        }
    }

    protected __setApp(): void {
        const { canvas } = this
        const { realCanvas, view } = this.config
        if (realCanvas || view === this.canvas.view || !canvas.parentView) this.realCanvas = true
        else canvas.unrealCanvas()

        this.leafer = this
        this.watcher.disable()
        this.layouter.disable()
    }

    override __updateLocalBounds(): void {
        this.forEach(leafer => leafer.updateLayout())
        super.__updateLocalBounds()
    }

    override start(): void {
        super.start()
        this.forEach(leafer => leafer.start())
    }

    override stop(): void {
        this.forEach(leafer => leafer.stop())
        super.stop()
    }

    override unlockLayout(): void {
        super.unlockLayout()
        this.forEach(leafer => leafer.unlockLayout())
    }

    override lockLayout(): void {
        super.lockLayout()
        this.forEach(leafer => leafer.lockLayout())
    }

    override forceRender(bounds?: IBoundsData, sync?: boolean): void {
        this.forEach(leafer => leafer.forceRender(bounds, sync))
    }

    public addLeafer(merge?: ILeaferConfig): Leafer {
        const leafer = new Leafer(merge)
        this.add(leafer)
        return leafer
    }

    override add(leafer: ILeafer, index?: number): void {
        if (!leafer.view) {
            if (this.realCanvas && !this.canvas.bounds) { // wait miniapp select canvas
                setTimeout(() => this.add(leafer, index), 10)
                return
            }
            leafer.init(this.__getChildConfig(leafer.userConfig), this)
        }

        super.add(leafer, index)
        if (!isUndefined(index)) leafer.canvas.childIndex = index
        this.__listenChildEvents(leafer)
    }

    public forEach(fn: IAppForEachFunction): void {
        this.children.forEach(fn)
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

    override __render(canvas: ILeaferCanvas, options: IRenderOptions): void {
        if (canvas.context) this.forEach(leafer => options.matrix ? leafer.__render(canvas, options) : canvas.copyWorld(leafer.canvas, options.bounds))
    }

    public __onResize(event: IResizeEvent): void {
        this.forEach(leafer => leafer.resize(event))
        super.__onResize(event)
    }

    public updateLayout(): void {
        this.forEach(leafer => leafer.updateLayout())
    }

    protected __getChildConfig(userConfig?: ILeaferConfig): ILeaferConfig {
        const config = { ...this.config }
        config.hittable = config.realCanvas = undefined
        if (userConfig) DataHelper.assign(config, userConfig)

        // reset
        if (this.autoLayout) DataHelper.copyAttrs(config, this, canvasSizeAttrs)
        config.view = this.realCanvas ? undefined : this.view
        config.fill = undefined
        return config
    }

    protected __listenChildEvents(leafer: ILeaferBase): void {
        leafer.once([
            [LayoutEvent.END, this.__onReady, this],
            [RenderEvent.START, this.__onCreated, this],
            [RenderEvent.END, this.__onViewReady, this]
        ])
        if (this.realCanvas) this.__eventIds.push(leafer.on_(RenderEvent.END, this.__onChildRenderEnd, this))
    }

}