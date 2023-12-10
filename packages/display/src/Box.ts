import { ILeaferCanvas, IRenderOptions, IPathDrawer, IBoundsData, IPathCommandData } from '@leafer/interface'
import { rewrite, rewriteAble, registerUI, BoundsHelper, dataProcessor, affectRenderBoundsType } from '@leafer/core'

import { IBox, IBoxData, IBoxInputData, IOverflow } from '@leafer-ui/interface'
import { BoxData } from '@leafer-ui/data'

import { Group } from './Group'
import { Rect } from './Rect'

const rect = Rect.prototype
const group = Group.prototype
const bounds = {} as IBoundsData
const { copy, add } = BoundsHelper

@rewriteAble()
@registerUI()
export class Box extends Group implements IBox {

    public get __tag() { return 'Box' }

    @dataProcessor(BoxData)
    declare public __: IBoxData

    @affectRenderBoundsType('show')
    declare public overflow: IOverflow

    constructor(data?: IBoxInputData) {
        super(data)
        this.isBranchLeaf = true
        this.__layout.renderChanged || this.__layout.renderChange()
    }

    public __scaleResize(scaleX: number, scaleY: number): void {
        if (this.__.__autoBounds && this.children.length) {
            super.__scaleResize(scaleX, scaleY)
        } else {
            this.width *= scaleX
            this.height *= scaleY
        }
    }

    @rewrite(rect.__updateStrokeSpread)
    public __updateStrokeSpread(): number { return 0 }

    @rewrite(rect.__updateRenderSpread)
    public __updateRectRenderSpread(): number { return 0 }

    public __updateRenderSpread(): number {
        let width = this.__updateRectRenderSpread() || super.__updateRenderSpread()
        this.__.__drawAfterFill = this.__.overflow === 'hide'
        if (!width) width = this.__.__drawAfterFill ? 0 : 1
        return width
    }


    @rewrite(rect.__updateBoxBounds)
    public __updateRectBoxBounds(): void { }

    public __updateBoxBounds(): void {
        if (this.__.__autoBounds && this.children.length) {
            super.__updateBoxBounds()
        } else {
            this.__updateRectBoxBounds()
        }
    }

    @rewrite(rect.__updateStrokeBounds)
    public __updateStrokeBounds(): void { }

    public __updateRenderBounds(): void {
        this.__updateRectRenderBounds()
        if (!this.__.__drawAfterFill) {
            const { renderBounds } = this.__layout
            copy(bounds, renderBounds)
            super.__updateRenderBounds()
            add(renderBounds, bounds)
        }
    }


    @rewrite(rect.__updateRenderBounds)
    public __updateRectRenderBounds(): void { }

    @rewrite(rect.__updateChange)
    public __updateRectChange(): void { }

    public __updateChange(): void {
        super.__updateChange()
        this.__updateRectChange()
    }


    @rewrite(rect.__drawPathByData)
    public __drawPathByData(_drawer: IPathDrawer, _data: IPathCommandData): void { }


    @rewrite(rect.__render)
    public __renderRect(_canvas: ILeaferCanvas, _options: IRenderOptions): void { }

    @rewrite(group.__render)
    public __renderGroup(_canvas: ILeaferCanvas, _options: IRenderOptions): void { }


    public __render(canvas: ILeaferCanvas, options: IRenderOptions): void {
        if (this.__.__drawAfterFill) {
            this.__renderRect(canvas, options)
        } else {
            this.__renderRect(canvas, options)
            this.__renderGroup(canvas, options)
        }
    }

    public __drawAfterFill(canvas: ILeaferCanvas, options: IRenderOptions): void {
        canvas.save()
        canvas.clip()
        this.__renderGroup(canvas, options)
        canvas.restore()
        if (this.__.stroke) this.__drawRenderPath(canvas)
    }

}
