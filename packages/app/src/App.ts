import { ILeaferConfig, IResizeEvent, ILeaferCanvas, IRenderOptions } from '@leafer/interface'
import { DataHelper, LayoutEvent, RenderEvent } from '@leafer/core'

import { IGroup } from '@leafer-ui/interface'

import { Leafer } from './Leafer'


export class App extends Leafer implements IGroup {

    public get isApp(): boolean { return true }

    public children: Leafer[] = []

    constructor(userConfig?: ILeaferConfig) {
        super(userConfig)
    }

    public start(): void {
        this.children.forEach(leafer => { leafer.start() })
        this.renderer.start()
        this.running = true
    }

    public stop(): void {
        this.children.forEach(leafer => { leafer.stop() })
        this.renderer.stop()
        this.running = false
    }

    public addLeafer(merge?: ILeaferConfig): Leafer {
        const leafer = new Leafer(this.__getChildConfig(merge), this)
        this.add(leafer)

        const { renderer } = this

        this.__eventIds.push(
            leafer.on__(LayoutEvent.END, this.__onChildLayoutEnd, this),
            leafer.on__(RenderEvent.END, renderer.update, renderer),
            this.on__(LayoutEvent.REQUEST, renderer.mergeBlocks, renderer),
        )

        return leafer
    }

    protected __onChildLayoutEnd(event: LayoutEvent): void {
        const { renderer } = this
        if ((event.current as Leafer).config.usePartRender) {
            event.data.map(item => renderer.addBlock(item.updatedBounds))
        } else {
            renderer.addBlock(renderer.canvas.bounds)
        }
    }

    public __render(canvas: ILeaferCanvas, _options: IRenderOptions): void {
        this.children.forEach(leafer => { canvas.copyWorld(leafer.canvas) })
    }

    public __onResize(event: IResizeEvent): void {
        this.emitEvent(event)
        this.children.forEach(leafer => { leafer.resize(event) })
    }

    protected __getChildConfig(userConfig?: ILeaferConfig): ILeaferConfig {
        let old = { ...this.config }
        userConfig = userConfig ? DataHelper.default(userConfig, old) : old
        userConfig.view = null
        if (this.autoLayout) {
            userConfig.width = this.width
            userConfig.height = this.height
            userConfig.pixelRatio = this.pixelRatio
        }
        return userConfig
    }

    public destory(): void {
        super.destory()

        const { children } = this
        if (children.length) {
            children.forEach(leafer => leafer.destory())
            children.length = 0
        }
    }

}