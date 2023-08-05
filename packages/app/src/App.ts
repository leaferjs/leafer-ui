import { ILeaferConfig, IResizeEvent, ILeaferCanvas, IRenderOptions, IApp, __Value, IFunction } from '@leafer/interface'
import { DataHelper, Debug, LayoutEvent, Platform, PropertyEvent, RenderEvent, canvasSizeAttrs, registerUI } from '@leafer/core'

import { Leafer } from './Leafer'


@registerUI()
export class App extends Leafer implements IApp {

    public get __tag() { return 'App' }

    public get isApp(): boolean { return true }

    public children: Leafer[] = []

    public realCanvas: boolean

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

        this.__eventIds.push(
            this.on_(PropertyEvent.CHANGE, () => {
                if (Debug.showHitView) this.children.forEach(leafer => { leafer.forceUpdate('blendMode') })
            })
        )
    }

    public start(): void {
        super.start()
        this.children.forEach(leafer => { leafer.start() })
    }

    public stop(): void {
        this.children.forEach(leafer => { leafer.stop() })
        super.stop()
    }

    public addLeafer(merge?: ILeaferConfig): Leafer {
        const leafer = new Leafer(merge)
        this.add(leafer)
        return leafer
    }

    public add(leafer: Leafer): void {
        if (!leafer.view) leafer.init(this.__getChildConfig(leafer.userConfig), this)
        super.add(leafer)

        leafer.once(LayoutEvent.END, () => {
            if (!this.ready && this.children.every(child => child.ready)) this.__onReady()
        })

        leafer.once(RenderEvent.END, () => {
            if (!this.viewReady && this.children.every(child => child.viewReady)) this.__onViewReady()
        })

        if (this.realCanvas) {
            this.__eventIds.push(
                leafer.on_(RenderEvent.END, this.__onChildRenderEnd, this),
            )
        }
    }

    public waitViewLoaded(fun: IFunction): void {
        const wait = () => { if (this.children.every(item => item.viewLoaded)) Platform.requestRender(fun) }
        this.children.forEach(leafer => { leafer.waitViewLoaded(wait) })
        if (!this.running) this.start()
    }

    protected __onChildRenderEnd(e: RenderEvent): void {
        this.renderer.addBlock(e.renderBounds)
        if (this.viewReady) this.renderer.update()
    }

    public __render(canvas: ILeaferCanvas, _options: IRenderOptions): void {
        this.children.forEach(leafer => { canvas.copyWorld(leafer.canvas) })
    }

    public __onResize(event: IResizeEvent): void {
        this.children.forEach(leafer => { leafer.resize(event) })
        super.__onResize(event)
    }

    protected __checkUpdateLayout(): void {
        this.children.forEach(leafer => { leafer.__layout.checkUpdate() })
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

    public destroy(): void {
        this.children.forEach(leafer => { leafer.destroy() })
        this.children.length = 0
        super.destroy()
    }

}