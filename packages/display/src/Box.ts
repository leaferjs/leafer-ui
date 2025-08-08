import { ILeaferCanvas, IRenderOptions, IBoolean, INumber, IScrollPointData } from '@leafer/interface'
import { rewrite, rewriteAble, registerUI, BoundsHelper, dataProcessor, affectRenderBoundsType, dataType, boundsType, DataHelper, getBoundsData } from '@leafer/core'

import { IBox, IBoxData, IBoxInputData, IOverflow, IScrollConfig, IScroller } from '@leafer-ui/interface'
import { BoxData } from '@leafer-ui/data'

import { Group } from './Group'
import { Rect } from './Rect'


const { add, includes, scroll } = BoundsHelper
const rect = Rect.prototype, group = Group.prototype

@rewriteAble()
@registerUI()
export class Box extends Group implements IBox {

    public get __tag() { return 'Box' }

    public get isBranchLeaf(): boolean { return true }

    @dataProcessor(BoxData)
    declare public __: IBoxData

    // size
    @boundsType(100)
    declare public width?: INumber

    @boundsType(100)
    declare public height?: INumber

    @dataType(false)
    public resizeChildren?: IBoolean

    // @leafer-in/editor rewrite
    public textBox?: IBoolean

    @affectRenderBoundsType('show')
    declare public overflow?: IOverflow

    public isOverflow?: boolean

    // scroller rewrite
    public scrollConfig?: IScrollConfig

    public scroller?: IScroller
    public hasScroller?: boolean

    constructor(data?: IBoxInputData) {
        super(data)
        this.__layout.renderChanged || this.__layout.renderChange()
    }

    @rewrite(rect.__updateStrokeSpread)
    public __updateStrokeSpread(): number { return 0 }

    @rewrite(rect.__updateRenderSpread)
    public __updateRectRenderSpread(): number { return 0 }

    public __updateRenderSpread(): number { return this.__updateRectRenderSpread() || -1 }


    @rewrite(rect.__updateBoxBounds)
    public __updateRectBoxBounds(): void { }


    // @leafer-in/flow will rewrite
    public __updateBoxBounds(_secondLayout?: boolean): void {
        if (this.children.length && !this.pathInputed) {

            const data = this.__

            if (data.__autoSide) {

                if (data.__hasSurface) this.__extraUpdate() // Box自身存在样式，需要额外更新

                super.__updateBoxBounds()

                const { boxBounds } = this.__layout

                if (!data.__autoSize) {
                    if (data.__autoWidth) {
                        boxBounds.width += boxBounds.x, boxBounds.x = 0
                        boxBounds.height = data.height, boxBounds.y = 0
                    } else {
                        boxBounds.height += boxBounds.y, boxBounds.y = 0
                        boxBounds.width = data.width, boxBounds.x = 0
                    }
                }

                this.__updateNaturalSize()

            } else this.__updateRectBoxBounds()

        } else this.__updateRectBoxBounds()
    }

    @rewrite(rect.__updateStrokeBounds)
    public __updateStrokeBounds(): void { }

    public __updateRenderBounds(): void {
        let isOverflow: boolean

        if (this.children.length) {
            const data = this.__, layout = this.__layout, { renderBounds, boxBounds } = layout

            const childrenRenderBounds = layout.childrenRenderBounds || (layout.childrenRenderBounds = getBoundsData())
            super.__updateRenderBounds(childrenRenderBounds)
            scroll(childrenRenderBounds, data as IScrollPointData)  // 增加滚动逻辑

            this.__updateRectRenderBounds()

            isOverflow = !includes(boxBounds, childrenRenderBounds)
            if (isOverflow && data.overflow === 'show') add(renderBounds, childrenRenderBounds)
        } else this.__updateRectRenderBounds()

        DataHelper.stintSet(this, 'isOverflow', isOverflow)

        this.__checkScroll()
    }

    @rewrite(rect.__updateRenderBounds)
    public __updateRectRenderBounds(): void { }

    public __updateWorldBounds(): void {
        if (this.hasScroller) this.__updateScroll()
        super.__updateWorldBounds()
    }


    //  scroller will rewrite
    public __checkScroll(): void { }

    public __updateScroll(): void { }


    @rewrite(rect.__updateChange)
    public __updateRectChange(): void { }

    public __updateChange(): void {
        super.__updateChange()
        this.__updateRectChange()
    }


    @rewrite(rect.__render)
    public __renderRect(_canvas: ILeaferCanvas, _options: IRenderOptions): void { }

    @rewrite(group.__render)
    public __renderGroup(_canvas: ILeaferCanvas, _options: IRenderOptions): void { }


    public __render(canvas: ILeaferCanvas, options: IRenderOptions): void {
        if (this.__.__drawAfterFill) {
            this.__renderRect(canvas, options)
        } else {
            this.__renderRect(canvas, options)
            if (this.children.length) this.__renderGroup(canvas, options)
        }
        if (this.hasScroller) this.scroller.__render(canvas, options)
    }

    // in __drawAfterFill()
    public __drawContent(canvas: ILeaferCanvas, options: IRenderOptions): void {
        this.__renderGroup(canvas, options)

        if (this.__.__useStroke || this.__.__useEffect) { // 还原绘制路径
            canvas.setWorld(this.__nowWorld)
            this.__drawRenderPath(canvas)
        }
    }

}
