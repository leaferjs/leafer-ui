import { ILeaferCanvas, IPathDrawer, IPathCommandData, IHitType, INumber, IBoolean, IString, IPathString, IExportFileType, IPointData, ICursorType, IMaskType, IEraserType, IValue, IWindingRule, IPathCreator, IFourNumber, IBoundsData, IFlowType, IGap, IFlowWrap, IAxis, IConstraint, IAutoBoxData, IFlowBoxType, IPointGap, IFlowAlign, IFlowAxisAlign, IFindCondition, IAutoSize, IRangeSize, IAlign, IUnitPointData, IObject } from '@leafer/interface'
import { Leaf, PathDrawer, surfaceType, dataType, positionType, boundsType, pathType, scaleType, rotationType, opacityType, visibleType, sortType, maskType, dataProcessor, registerUI, useModule, rewrite, rewriteAble, UICreator, PathCorner, hitType, strokeType, PathConvert, eraserType, cursorType, autoLayoutType, pen, naturalBoundsType, pathInputType } from '@leafer/core'

import { IUI, IShadowEffect, IBlurEffect, IStrokeAlign, IStrokeJoin, IStrokeCap, IBlendMode, IDashPatternString, IShadowString, IGrayscaleEffect, IUIData, IGroup, IStrokeWidthString, ICornerRadiusString, IUIInputData, IExportOptions, IExportResult, IFill, IStroke, IArrowType, IFindUIMethod, ILeafer, IEditorConfig, IEditorConfigFunction, IEditToolFunction, IKeyframe, IKeyframes, IAnimation, IAnimationOptions, IAnimationControl } from '@leafer-ui/interface'
import { arrowType, effectType, stateType, zoomLayerType } from '@leafer-ui/decorator'

import { UIData } from '@leafer-ui/data'
import { UIBounds, UIRender } from '@leafer-ui/display-module'

import { Export, PathArrow } from '@leafer-ui/external'


@useModule(UIBounds)
@useModule(UIRender)
@rewriteAble()
export class UI extends Leaf implements IUI { // tip: rewrited Box

    @dataProcessor(UIData)
    declare public __: IUIData

    declare public proxyData?: IUIInputData // need rewrite getter
    declare public __proxyData?: IUIInputData

    public get app(): ILeafer { return this.leafer && this.leafer.app }

    declare public leafer?: ILeafer
    declare public parent?: IGroup

    @zoomLayerType()
    public zoomLayer: IGroup

    public get isFrame(): boolean { return false }

    declare public children?: IUI[]

    // ---

    // id
    @dataType('')
    public id?: IString

    @dataType('')
    public name?: IString

    @dataType('')
    public className?: IString


    // layer
    @surfaceType('pass-through')
    public blendMode?: IBlendMode

    @opacityType(1)
    public opacity?: INumber

    @visibleType(true)
    public visible?: IBoolean | 0


    @stateType(false)
    public selected?: IBoolean

    @stateType(false)
    public disabled?: IBoolean

    @surfaceType(false)
    public locked?: IBoolean


    @sortType(0)
    public zIndex?: INumber


    @maskType(false)
    public mask?: IBoolean | IMaskType

    @eraserType(false)
    public eraser?: IBoolean | IEraserType


    // position
    @positionType(0, true)
    public x?: INumber

    @positionType(0, true)
    public y?: INumber

    // size
    @boundsType(100, true)
    public width?: INumber

    @boundsType(100, true)
    public height?: INumber

    // scale
    @scaleType(1, true)
    public scaleX?: INumber

    @scaleType(1, true)
    public scaleY?: INumber

    // rotate
    @rotationType(0, true)
    public rotation?: INumber

    // skew
    @rotationType(0, true)
    public skewX?: INumber

    @rotationType(0, true)
    public skewY?: INumber


    // offset
    @positionType(0, true)
    public offsetX?: INumber

    @positionType(0, true)
    public offsetY?: INumber

    // scroll
    @positionType(0, true)
    public scrollX?: INumber

    @positionType(0, true)
    public scrollY?: INumber


    // center
    @autoLayoutType()
    public origin?: IAlign | IUnitPointData

    @autoLayoutType()
    public around?: IAlign | IUnitPointData


    // image
    @dataType(false)
    public lazy?: IBoolean  // load image / compute paint

    @naturalBoundsType(1)
    public pixelRatio?: INumber


    // path
    @pathInputType()
    public path?: IPathCommandData | IPathString

    @pathType()
    public windingRule?: IWindingRule

    @pathType(true)
    public closed?: boolean


    // auto layout
    @autoLayoutType(false)
    public flow?: IFlowType

    @boundsType(0)
    public padding?: IFourNumber

    @boundsType(0)
    public gap?: IGap | IPointGap

    @boundsType('top-left')
    public flowAlign?: IFlowAlign | IFlowAxisAlign

    @boundsType(false)
    public flowWrap?: IFlowWrap

    @boundsType('box')
    public itemBox?: IFlowBoxType


    @boundsType(true)
    public inFlow?: IBoolean

    @boundsType() // rewrite in flow
    public autoWidth?: IAutoSize

    @boundsType()  // rewrite in flow
    public autoHeight?: IAutoSize

    @boundsType()
    public lockRatio?: IBoolean

    @boundsType()
    public autoBox?: IAutoBoxData | IConstraint


    @boundsType()
    public widthRange?: IRangeSize

    @boundsType()
    public heightRange?: IRangeSize


    // drag
    @dataType(false)
    public draggable?: IBoolean | IAxis

    @dataType()
    public dragBounds?: IBoundsData | 'parent'


    @dataType(false)
    public editable?: IBoolean


    // hit
    @hitType(true)
    public hittable?: IBoolean

    @hitType('path')
    public hitFill?: IHitType

    @strokeType('path')
    public hitStroke?: IHitType

    @hitType(false)
    public hitBox?: IBoolean

    @hitType(true)
    public hitChildren?: IBoolean

    @hitType(true)
    public hitSelf?: IBoolean

    @hitType()
    public hitRadius?: INumber

    @cursorType('')
    public cursor?: ICursorType | ICursorType[]

    // ---


    // fill

    @surfaceType()
    public fill?: IFill

    // stroke

    @strokeType()
    public stroke?: IStroke

    @strokeType('inside')
    public strokeAlign?: IStrokeAlign

    @strokeType(1)
    public strokeWidth?: IFourNumber | IStrokeWidthString

    @strokeType(false)
    public strokeWidthFixed?: IBoolean

    @strokeType('none')
    public strokeCap?: IStrokeCap

    @strokeType('miter')
    public strokeJoin?: IStrokeJoin

    @strokeType()
    public dashPattern?: INumber[] | IDashPatternString

    @strokeType()
    public dashOffset?: INumber

    @strokeType(10)
    public miterLimit?: INumber


    // arrow

    @arrowType('none')
    public startArrow?: IArrowType

    @arrowType('none')
    public endArrow?: IArrowType

    // corner

    @pathType(0)
    public cornerRadius?: IFourNumber | ICornerRadiusString

    @pathType()
    public cornerSmoothing?: INumber

    // effect

    @effectType()
    public shadow?: IShadowEffect | IShadowEffect[] | IShadowString

    @effectType()
    public innerShadow?: IShadowEffect | IShadowEffect[] | IShadowString

    @effectType()
    public blur?: INumber | IBlurEffect

    @effectType()
    public backgroundBlur?: INumber | IBlurEffect

    @effectType()
    public grayscale?: INumber | IGrayscaleEffect


    // states

    @dataType()
    public normalStyle?: IUIInputData // auto restore hover / press / focus / selected / disabled style

    @dataType()
    public hoverStyle?: IUIInputData

    @dataType()
    public pressStyle?: IUIInputData

    @dataType()
    public focusStyle?: IUIInputData

    @dataType()
    public selectedStyle?: IUIInputData

    @dataType()
    public disabledStyle?: IUIInputData


    // 预留给用户使用的数据对象
    @dataType({})
    public data: IObject


    public set scale(value: INumber | IPointData) {
        if (typeof value === 'number') {
            this.scaleX = this.scaleY = value
        } else {
            this.scaleX = value.x
            this.scaleY = value.y
        }
    }

    public get scale(): INumber | IPointData {
        const { scaleX, scaleY } = this
        return scaleX !== scaleY ? { x: scaleX, y: scaleY } : scaleX
    }

    public get pen(): IPathCreator {
        const { path } = this.__
        pen.set(this.path = path || [])
        if (!path) this.__drawPathByBox(pen)
        return pen
    }


    // editor

    public get editConfig(): IEditorConfig { return undefined }

    public get editOuter(): string { return this.__.__isLinePath ? 'LineEditTool' : 'EditTool' }

    public get editInner(): string { return 'PathEditor' }


    constructor(data?: IUIInputData) {
        super(data)
    }


    // data

    @rewrite(Leaf.prototype.reset)
    public reset(_data?: IUIInputData): void { }


    public set(data: IUIInputData): void {
        Object.assign(this, data)
    }

    public get(name?: string | string[] | IUIInputData): IUIInputData | IValue {
        return typeof name === 'string' ? this.__.__getInput(name) : this.__.__getInputData(name)
    }

    public createProxyData(): IUIInputData { return undefined }


    // hit rewrite

    public find(_condition: number | string | IFindCondition | IFindUIMethod, _options?: any): IUI[] { return undefined }

    public findTag(tag: string | string[]): IUI[] { return this.find({ tag }) }

    public findOne(_condition: number | string | IFindCondition | IFindUIMethod, _options?: any): IUI | undefined { return undefined }

    public findId(id: number | string): IUI | undefined { return this.findOne({ id }) }


    // path

    public getPath(curve?: boolean, pathForRender?: boolean): IPathCommandData {
        this.__layout.update()
        let path = pathForRender ? this.__.__pathForRender : this.__.path
        if (!path) pen.set(path = []), this.__drawPathByBox(pen)
        return curve ? PathConvert.toCanvasData(path, true) : path
    }

    public getPathString(curve?: boolean, pathForRender?: boolean): IPathString {
        return PathConvert.stringify(this.getPath(curve, pathForRender))
    }


    public load(): void {
        this.__.__computePaint() // 手动加载图片
    }

    public __onUpdateSize(): void {
        if (this.__.__input) {
            const data = this.__;
            (data.lazy && !this.__inLazyBounds && !Export.running) ? data.__needComputePaint = true : data.__computePaint()
        }
    }

    public __updateRenderPath(): void {
        if (this.__.path) {
            const data = this.__
            data.__pathForRender = data.cornerRadius ? PathCorner.smooth(data.path, data.cornerRadius, data.cornerSmoothing) : data.path
            if (data.__useArrow) PathArrow.addArrows(this, !data.cornerRadius)
        }
    }

    public __drawRenderPath(canvas: ILeaferCanvas): void {
        canvas.beginPath()
        this.__drawPathByData(canvas, this.__.__pathForRender)
    }

    public __drawPath(canvas: ILeaferCanvas): void {
        canvas.beginPath()
        this.__drawPathByData(canvas, this.__.path)
    }

    public __drawPathByData(drawer: IPathDrawer, data: IPathCommandData): void {
        if (data) {
            PathDrawer.drawPathByData(drawer, data)
        } else {
            this.__drawPathByBox(drawer)
        }
    }

    public __drawPathByBox(drawer: IPathDrawer): void {
        const { x, y, width, height } = this.__layout.boxBounds
        if (this.__.cornerRadius) {
            const { cornerRadius } = this.__
            drawer.roundRect(x, y, width, height, typeof cornerRadius === 'number' ? [cornerRadius] : cornerRadius) // 修复微信浏览器bug, 后续需进一步优化
        } else {
            drawer.rect(x, y, width, height)
        }
    }

    // @leafer-in/animate rewite

    public animate(_animation: IKeyframe | IKeyframes | IAnimation, options?: IAnimationOptions): IAnimationControl { return undefined }


    // create

    public export(filename: IExportFileType | string, options?: IExportOptions | number | boolean): Promise<IExportResult> {
        return Export.export(this, filename, options)
    }

    public clone(): IUI {
        return UI.one(this.toJSON())
    }

    static one(data: IUIInputData, x?: number, y?: number, width?: number, height?: number): IUI {
        return UICreator.get(data.tag || this.prototype.__tag, data, x, y, width, height) as IUI
    }

    static registerUI(): void {
        registerUI()(this)
    }

    static registerData(data: IUIData): void {
        dataProcessor(data)(this.prototype)
    }


    // @leafer-in/editor rewrite

    static setEditConfig(_config: IEditorConfig | IEditorConfigFunction): void { }

    static setEditOuter(_toolName: string | IEditToolFunction): void { }

    static setEditInner(_editorName: string | IEditToolFunction): void { }


    public destroy(): void {
        this.fill = this.stroke = null
        super.destroy()
    }

}
