import { ILeaferCanvas, IPathDrawer, IPathCommandData, IHitType, __Number, __Boolean, __String, IPathString, IExportFileType } from '@leafer/interface'
import { Leaf, PathDrawer, surfaceType, dataType, positionType, boundsType, pathType, scaleType, rotationType, opacityType, sortType, maskType, dataProcessor, useModule, rewrite, rewriteAble, UICreator, PathCorner, hitType, strokeType, PathConvert, eraserType } from '@leafer/core'

import { IUI, IShadowEffect, IBlurEffect, IPaint, IStrokeAlign, IStrokeJoin, IStrokeCap, IBlendMode, IPaintString, IDashPatternString, IShadowString, IGrayscaleEffect, IUIData, IGroup, IStrokeWidthString, ICornerRadiusString, IUITagInputData, IUIInputData, IExportOptions, IExportResult } from '@leafer-ui/interface'
import { effectType } from '@leafer-ui/decorator'

import { UIData } from '@leafer-ui/data'
import { UIBounds, UIHit, UIRender } from '@leafer-ui/display-module'

import { Export, Paint } from '@leafer-ui/external'


@useModule(UIBounds)
@useModule(UIHit)
@useModule(UIRender)
@rewriteAble()
export class UI extends Leaf implements IUI {

    @dataProcessor(UIData)
    public __: IUIData

    public parent?: IGroup

    // ---

    // id
    @dataType('')
    public id: __String

    @dataType('')
    public name: __String

    @dataType('')
    public className: __String


    // layer
    @surfaceType('pass-through')
    public blendMode: IBlendMode

    @opacityType(1)
    public opacity: __Number

    @opacityType(true)
    public visible: __Boolean

    @maskType(false)
    public isMask: __Boolean

    @eraserType(false)
    public isEraser?: __Boolean

    @sortType(0)
    public zIndex: __Number

    @dataType()
    public locked: __Boolean


    // position
    @positionType(0)
    public x: __Number

    @positionType(0)
    public y: __Number

    // size
    @boundsType(100)
    public width: __Number

    @boundsType(100)
    public height: __Number

    // scale
    @scaleType(1)
    public scaleX: __Number

    @scaleType(1)
    public scaleY: __Number

    // rotate
    @rotationType(0)
    public rotation: __Number

    // skew
    @rotationType(0)
    public skewX: __Number

    @rotationType(0)
    public skewY: __Number


    @dataType(false)
    public draggable: __Boolean

    // hit
    @hitType(true)
    public hittable: __Boolean

    @hitType('path')
    public hitFill: IHitType

    @strokeType('path')
    public hitStroke: IHitType

    @hitType(true)
    public hitChildren: __Boolean

    @hitType(true)
    public hitSelf: __Boolean

    // ---


    // fill

    @surfaceType()
    public fill: IPaint | IPaint[] | IPaintString

    // stroke

    @strokeType()
    public stroke: IPaint | IPaint[] | IPaintString

    @strokeType('inside')
    public strokeAlign: IStrokeAlign

    @strokeType(1)
    public strokeWidth: number | number[] | IStrokeWidthString

    @strokeType('none')
    public strokeCap: IStrokeCap

    @strokeType('miter')
    public strokeJoin: IStrokeJoin

    @strokeType()
    public dashPattern: __Number[] | IDashPatternString

    @strokeType()
    public dashOffset: __Number

    @strokeType(10)
    public miterLimit: __Number


    // corner

    @pathType()
    public cornerRadius: number | number[] | ICornerRadiusString

    @pathType()
    public cornerSmoothing: __Number

    // effect

    @effectType()
    public shadow: IShadowEffect | IShadowEffect[] | IShadowString

    @effectType()
    public innerShadow: IShadowEffect | IShadowEffect[] | IShadowString

    @effectType()
    public blur: __Number | IBlurEffect

    @effectType()
    public backgroundBlur: __Number | IBlurEffect

    @effectType()
    public grayscale: __Number | IGrayscaleEffect


    constructor(data?: IUIInputData) {
        super(data)
    }


    public set(data: IUITagInputData): void {
        Object.assign(this, data)
    }

    public get(): IUITagInputData {
        return this.__.__getInputData()
    }


    public getPath(curve?: boolean): IPathCommandData {
        const path = this.__.path
        if (!path) return []
        return curve ? PathConvert.toCanvasData(path, true) : path
    }

    public getPathString(curve?: boolean): IPathString {
        return PathConvert.stringify(this.getPath(curve))
    }


    public __onUpdateSize(): void {
        if (this.__.__input) {
            const { fill, stroke } = this.__.__input
            if (fill) Paint.computeFill(this)
            if (stroke) Paint.computeStroke(this)
        }
    }

    public __updateRenderPath(): void {
        if (this.__.path) {
            const { __: data } = this
            data.__pathForRender = data.cornerRadius ? PathCorner.smooth(data.path, data.cornerRadius, data.cornerSmoothing) : data.path
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

    @rewrite(PathDrawer.drawPathByData)
    public __drawPathByData(_drawer: IPathDrawer, _data: IPathCommandData): void { }

    public export(filename: IExportFileType | string, options?: IExportOptions | number | boolean): Promise<IExportResult> {
        return Export.export(this, filename, options)
    }

    static one(data: IUITagInputData, x?: number, y?: number, width?: number, height?: number): IUI {
        return UICreator.get(data.tag || this.prototype.__tag, data, x, y, width, height) as IUI
    }

}
