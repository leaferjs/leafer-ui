import { ILeaferConfig, IResizeEvent, ILeaferCanvas, IRenderOptions } from '@leafer/interface'
import { registerUI, DataHelper, RenderEvent } from '@leafer/core'

import { IGroup } from '@leafer-ui/interface'

import { Leafer } from './Leafer'


@registerUI()
export class SuperLeafer extends Leafer implements IGroup {

    public get isSupperLeafer(): boolean { return true }

    public children: Leafer[] = []

    public start(): void {
        if (!this.running) {
            this.children.forEach(leafer => { leafer.start() })
            this.running = false
        }
    }

    public stop(): void {
        if (this.running) {
            this.children.forEach(leafer => { leafer.stop() })
            this.running = false
        }
    }

    public addLeafer(merge?: ILeaferConfig): Leafer {
        const leafer = new Leafer(this.__getChildConfig(merge), this)
        this.add(leafer)
        this.__eventIds.push(leafer.on__(RenderEvent.END, this.renderer.start, this.renderer))
        return leafer
    }

    public __render(canvas: ILeaferCanvas, options: IRenderOptions): void {
        this.children.forEach(leafer => { canvas.copy(leafer.canvas) })
    }

    public __onResize(event: IResizeEvent): void {
        this.emitEvent(event)
        this.children.forEach(leafer => { leafer.resize(event) })
    }

    protected __getChildConfig(userConfig?: ILeaferConfig): ILeaferConfig {
        let old = { ...this.config }
        userConfig = userConfig ? DataHelper.default(userConfig, old) : old
        userConfig.view = undefined
        if (this.autoLayout) {
            userConfig.width = this.width
            userConfig.height = this.height
            userConfig.pixelRatio = this.pixelRatio
        }
        return userConfig
    }

    public destory(): void {
        if (this.children.length) {
            super.destory()
            this.children.forEach(leafer => {
                leafer.destory()
            })
            this.children.length = 0
        }
    }

}