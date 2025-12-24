import { ILeaferCanvas, IRenderOptions, IPathDrawer, IPathCommandData, IHitType, INumber, IBoolean, IString, IPathString, IExportFileType, IPointData, ICursorType, IMaskType, IEraserType, IWindingRule, IPathCreator, IFourNumber, IBoundsData, IFlowType, IGap, IFlowWrap, IAxis, IConstraint, IAutoBoxData, IFlowBoxType, IPointGap, IFlowAlign, IFlowAxisAlign, IFindCondition, IAutoSize, IRangeSize, IAlign, IUnitPointData, IObject, IScaleData, IUnitData, IPathCommandObject, ITransition, IFilter, IScaleFixed, IDragBoundsType, IPathCommandNode } from '@leafer/interface'
import { Leaf, PathDrawer, surfaceType, dimType, dataType, positionType, scrollType, boundsType, pathType, scaleType, rotationType, opacityType, visibleType, sortType, maskType, dataProcessor, registerUI, useModule, rewrite, rewriteAble, UICreator, PathCorner, hitType, strokeType, PathConvert, eraserType, cursorType, autoLayoutType, pen, naturalBoundsType, pathInputType, MathHelper, Plugin, DataHelper, affectRenderBoundsType, isString, isNumber } from '@leafer/core'

import { IUI, IShadowEffect, IBlurEffect, IStrokeAlign, IStrokeJoin, IStrokeCap, IBlendMode, IDashPatternString, IShadowString, IGrayscaleEffect, IUIData, IGroup, IStrokeWidthString, ICornerRadiusString, IUIInputData, IExportOptions, IExportResult, IFill, IStroke, IArrowStyle, IFindUIMethod, ILeafer, IEditorConfig, IEditorConfigFunction, IEditToolFunction, IKeyframe, IAnimation, IAnimate, IStates, IStateName, IAnimateType, IStateStyle, IColorString, IAnimateList, ILeafPaint } from '@leafer-ui/interface'
import { effectType, zoomLayerType } from '@leafer-ui/decorator'

import { UIData } from '@leafer-ui/data'
import { UIBounds, UIRender } from '@leafer-ui/display-module'

import { Export, Paint, PathArrow } from '@leafer-ui/external'


@useModule(UIBounds)
@useModule(UIRender)
@rewriteAble()
export class UI<TInputData = IUIInputData> extends Leaf<TInputData> implements IUI { // tip: rewrited Box

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


    @surfaceType(false)
    public locked?: IBoolean


    // @leafer-in/bright will rewrite

    @dimType(false)
    public dim?: IBoolean | INumber // 是否弱化内容，可设置具体透明度

    @dimType(false)
    public dimskip?: IBoolean // 跳过弱化，突出显示内容，不受dim影响

    public bright?: IBoolean // 突出显示内容，并置顶渲染，不受dim影响


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

    // @leafer-in/scale-fixed will rewrite
    public scaleFixed?: IScaleFixed

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
    @scrollType(0, true)
    public scrollX?: INumber

    @scrollType(0, true)
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


    @affectRenderBoundsType(0)
    public renderSpread?: IFourNumber // 强行扩大渲染边界


    // path
    @pathInputType()
    public path?: IPathCommandData | IPathCommandNode[] | IPathCommandObject[] | IPathString

    @pathType()
    public windingRule?: IWindingRule

    @pathType(true)
    public closed?: boolean


    // @leafer-in/flow rewrite
    public flow?: IFlowType

    @boundsType(0)
    public padding?: IFourNumber

    public gap?: IGap | IPointGap

    public flowAlign?: IFlowAlign | IFlowAxisAlign

    public flowWrap?: IFlowWrap


    public itemBox?: IFlowBoxType

    public inFlow?: IBoolean


    public autoWidth?: IAutoSize

    public autoHeight?: IAutoSize

    @boundsType(false)
    public lockRatio?: IBoolean

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

    @dataType('auto')
    dragBoundsType?: IDragBoundsType


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

    @strokeType(undefined, true)
    public stroke?: IStroke

    @strokeType('inside')
    public strokeAlign?: IStrokeAlign

    @strokeType(1, true)
    public strokeWidth?: IFourNumber | IStrokeWidthString

    @strokeType(false)
    public strokeWidthFixed?: IScaleFixed

    @strokeType('none')
    public strokeCap?: IStrokeCap

    @strokeType('miter')
    public strokeJoin?: IStrokeJoin

    @strokeType()
    public dashPattern?: INumber[] | IDashPatternString

    @strokeType(0)
    public dashOffset?: INumber

    @strokeType(10)
    public miterLimit?: INumber


    // @leafer-in/arrow rewrite

    public startArrow?: IArrowStyle

    public endArrow?: IArrowStyle

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

    @effectType()
    public filter?: IFilter | IFilter[]


    // @leafer-in/animate rewrite

    public animation?: IAnimation | IAnimation[]

    public animationOut?: IAnimation | IAnimation[]


    public transition?: ITransition

    public transitionOut?: ITransition


    // @leafer-in/motion-path rewrite

    public motionPath?: boolean

    public motionPrecision?: INumber


    public motion?: INumber | IUnitData

    public motionRotation?: INumber | IBoolean


    // @leafer-in/state rewrite

    public states?: IStates

    public state?: IStateName


    public selected?: IBoolean

    public disabled?: IBoolean


    public normalStyle?: IStateStyle

    public hoverStyle?: IStateStyle

    public pressStyle?: IStateStyle

    public focusStyle?: IStateStyle

    public selectedStyle?: IStateStyle

    public disabledStyle?: IStateStyle


    public placeholderStyle?: IStateStyle

    @surfaceType()
    public placeholderColor?: IColorString

    @dataType(100)
    public placeholderDelay?: INumber


    public button?: IBoolean


    //  @leafer-in/editor rewrite

    public editConfig: IEditorConfig

    public editOuter: string

    public editInner: string


    // 预留给用户使用的数据对象
    @dataType({})
    public data: IObject


    public set scale(value: INumber | IPointData) { MathHelper.assignScale(this as IScaleData, value) }
    public get scale(): INumber | IPointData { return this.__.scale }

    public get isAutoWidth(): boolean { const t = this.__; return t.__autoWidth || t.autoWidth as boolean }
    public get isAutoHeight(): boolean { const t = this.__; return t.__autoHeight || t.autoHeight as boolean }

    public useFastShadow?: boolean // 将忽略 stroke 产生的阴影，只对单个 fill 有效

    public __box?: IUI // 背景box, 一般用于文本背景框
    public __animate?: IAnimate | IAnimateList

    public get pen(): IPathCreator {
        const { path } = this.__
        pen.set(this.path = path || [])
        if (!path) this.__drawPathByBox(pen)
        return pen
    }


    // data

    @rewrite(Leaf.prototype.reset)
    public reset(_data?: IUIInputData): void { }


    // @leafer-in/animate and @leafer-in/state will rewrite

    public set(data: IUIInputData, _transition?: ITransition | 'temp'): void {
        if (data) Object.assign(this, data)
    }

    public get<K extends keyof this>(name?: K | K[] | IUIInputData): IUIInputData | this[K] {
        return isString(name) ? this.__.__getInput(name) : this.__.__getInputData(name as string[] | undefined)
    }

    public createProxyData(): IUIInputData { return undefined }


    // hit rewrite

    public find(_condition: number | string | IFindCondition | IFindUIMethod, _options?: any): IUI[] { return Plugin.need('find') }

    public findTag(tag: string | string[]): IUI[] { return this.find({ tag }) }

    public findOne(_condition: number | string | IFindCondition | IFindUIMethod, _options?: any): IUI | undefined { return Plugin.need('find') }

    public findId(id: number | string): IUI | undefined { return this.findOne({ id }) }


    // path

    public getPath(curve?: boolean, pathForRender?: boolean): IPathCommandData {
        this.__layout.update()
        let path = pathForRender ? this.__.__pathForRender : this.__.path
        if (!path) pen.set(path = []), this.__drawPathByBox(pen, !pathForRender)
        return curve ? PathConvert.toCanvasData(path, true) : path
    }

    public getPathString(curve?: boolean, pathForRender?: boolean, floatLength?: number): IPathString {
        return PathConvert.stringify(this.getPath(curve, pathForRender), floatLength)
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
        const data = this.__
        if (data.path) {
            data.__pathForRender = data.cornerRadius ? PathCorner.smooth(data.path, data.cornerRadius, data.cornerSmoothing) : data.path
            if (data.__useArrow) PathArrow.addArrows(this)
        } else data.__pathForRender && (data.__pathForRender = undefined)
    }

    public __drawRenderPath(canvas: ILeaferCanvas): void {
        canvas.beginPath()
        this.__drawPathByData(canvas, this.__.__pathForRender)
    }

    public __drawPath(canvas: ILeaferCanvas): void {
        canvas.beginPath()
        this.__drawPathByData(canvas, this.__.path, true)
    }

    public __drawPathByData(drawer: IPathDrawer, data: IPathCommandData, ignoreCornerRadius?: boolean): void {
        data ? PathDrawer.drawPathByData(drawer, data) : this.__drawPathByBox(drawer, ignoreCornerRadius)
    }

    public __drawPathByBox(drawer: IPathDrawer, ignoreCornerRadius?: boolean): void {
        const { x, y, width, height } = this.__layout.boxBounds
        if (this.__.cornerRadius && !ignoreCornerRadius) {
            const { cornerRadius } = this.__
            drawer.roundRect(x, y, width, height, isNumber(cornerRadius) ? [cornerRadius] : cornerRadius) // 修复微信浏览器bug, 后续需进一步优化
        } else drawer.rect(x, y, width, height)
        drawer.closePath()
    }

    public drawImagePlaceholder(_paint: ILeafPaint, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void {
        Paint.fill(this.__.placeholderColor, this, canvas, renderOptions)  // 图片占位符
    }

    // @leafer-in/animate rewrite

    public animate(keyframe?: IUIInputData | IKeyframe[] | IAnimation | IAnimation[], _options?: ITransition, _type?: IAnimateType, _isTemp?: boolean): IAnimate {
        this.set(keyframe as IUIInputData)
        return Plugin.need('animate')
    }

    public killAnimate(_type?: IAnimateType, _nextStyle?: IUIInputData): void { }


    // create

    // @leafer-in/export will rewrite
    public export(_filename: IExportFileType | string, _options?: IExportOptions | number | boolean): Promise<IExportResult> {
        return Plugin.need('export')
    }

    public syncExport(_filename: IExportFileType | string, _options?: IExportOptions | number | boolean): IExportResult {
        return Plugin.need('export')
    }

    public clone(data?: IUIInputData): this {
        const json = DataHelper.clone(this.toJSON())
        if (data) Object.assign(json, data)
        return UI.one(json) as this
    }

    // this 参数定义，在编译的时候会移除
    static one<T extends UI>(this: new (...args: any[]) => T, data: IUIInputData, x?: number, y?: number, width?: number, height?: number): T {
        return UICreator.get(data.tag || this.prototype.__tag, data, x, y, width, height) as T
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
        if (this.__animate) this.killAnimate()
        super.destroy()
    }

}
