import { ILeaferCanvas, IRenderOptions, IBoundsData, IBoolean, INumber } from '@leafer/interface'
import { rewrite, rewriteAble, registerUI, BoundsHelper, dataProcessor, affectRenderBoundsType, dataType, boundsType, DataHelper } from '@leafer/core'

import { IBox, IBoxData, IBoxInputData, IGroup, IOverflow } from '@leafer-ui/interface'
import { BoxData } from '@leafer-ui/data'

import { Group } from './Group'
import { Rect } from './Rect'


const { copy, add, includes } = BoundsHelper
const rect = Rect.prototype, group = Group.prototype
const childrenRenderBounds = {} as IBoundsData

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

    public isOverflow: boolean

    public scrollBar?: IGroup

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
            const data = this.__, { renderBounds, boxBounds } = this.__layout

            super.__updateRenderBounds()
            copy(childrenRenderBounds, renderBounds)
            this.__updateRectRenderBounds()

            // 增加滚动逻辑
            if (data.scrollY || data.scrollX) {
                childrenRenderBounds.x += data.scrollX
                childrenRenderBounds.y += data.scrollY
            }

            isOverflow = !includes(boxBounds, childrenRenderBounds)
            if (isOverflow && data.overflow !== 'hide') add(renderBounds, childrenRenderBounds)
        } else this.__updateRectRenderBounds()

        DataHelper.stintSet(this, 'isOverflow', isOverflow)

        this.__updateScrollBar()
    }

    @rewrite(rect.__updateRenderBounds)
    public __updateRectRenderBounds(): void { }

    //  need rewrite
    public __updateScrollBar(): void { }


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
        if (this.scrollBar) this.scrollBar.__render(canvas, options)
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
