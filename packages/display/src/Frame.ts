import { ILeaferCanvas, IRenderOptions, ICanvasDrawPath, IBoundsData, IPathCommandData } from '@leafer/interface'
import { BoundsHelper, dataProcessor, boundsType, rewrite, useModule, rewriteAble, registerUI } from '@leafer/core'

import { IFrame, IFrameData, IFrameInputData } from '@leafer-ui/interface'
import { FrameData } from '@leafer-ui/data'
import { FrameRender } from '@leafer-ui/module'

import { Group } from './Group'
import { Rect } from './Rect'


const rect = Rect.prototype
const group = Group.prototype
const bounds = {} as IBoundsData
const { copy, add } = BoundsHelper


@useModule(FrameRender)
@rewriteAble()
@registerUI()
export class Frame extends Group implements IFrame {

    @dataProcessor(FrameData)
    public __: IFrameData

    @boundsType(true)
    public clip: boolean

    constructor(data?: IFrameInputData) {
        super(data)
        if (!this.fill) this.fill = '#FFFFFF'
        this.__isBranchLeaf = true
    }

    @rewrite(rect.__drawPathByData)
    public __drawPathByData(drawer: ICanvasDrawPath, data: IPathCommandData): void { }

    public __updateBoxBounds(): void {
        this.__updateRectBoxBounds()
        if (!this.__.clip) {
            const { boxBounds } = this.__layout
            copy(bounds, boxBounds)
            super.__updateBoxBounds()
            add(boxBounds, bounds)
        }
    }

    public __updateEventBounds(): void {
        this.__updateRectEventBounds()
        if (!this.__.clip) {
            const { eventBounds } = this.__layout
            copy(bounds, eventBounds)
            super.__updateEventBounds()
            add(eventBounds, bounds)
        }
    }

    public __updateRenderBounds(): void {
        this.__updateRectRenderBounds()
        if (!this.__.clip) {
            const { renderBounds } = this.__layout
            copy(bounds, renderBounds)
            super.__updateRenderBounds()
            add(renderBounds, bounds)
        }
    }

    @rewrite(rect.__updateBoxBounds)
    public __updateRectBoxBounds(): void { }

    @rewrite(rect.__updateEventBounds)
    public __updateRectEventBounds(): void { }

    @rewrite(rect.__updateRenderBounds)
    public __updateRectRenderBounds(): void { }


    @rewrite(rect.__render)
    public __renderRect(canvas: ILeaferCanvas, options: IRenderOptions): void { }

    @rewrite(group.__render)
    public __renderGroup(canvas: ILeaferCanvas, options: IRenderOptions): void { }

}
