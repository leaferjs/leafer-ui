import { ILeaferCanvas, ICanvasDrawPath, IPathCommandData, __Number, __Boolean, __String, IMatrixData, IBoundsData } from '@leafer/interface'
import { Leaf, PathHelper, affectEventBoundsType, surfaceType, dataType, positionType, boundsType, pathType, scaleType, rotationType, opacityType, sortType, dataProcessor, useModule, rewrite, rewriteAble } from '@leafer/core'

import { IUI, IShadowEffect, IBlurEffect, IPaint, IStrokeAlign, IStrokeJoin, IStrokeCap, IBlendMode, IPaintString, IDashPatternString, IShadowString, IGrayscaleEffect, IUIData, IGroup, IBorderWidthString, IBorderRadiusString } from '@leafer-ui/interface'
import { effectType } from '@leafer-ui/decorator'

import { UIData } from '@leafer-ui/data'
import { UIBounds, UIHit, UIRender } from '@leafer-ui/display-module'


@useModule(UIBounds)
@useModule(UIHit)
@useModule(UIRender)
@rewriteAble()
export class UI extends Leaf implements IUI {


    @dataProcessor(UIData)
    public __: IUIData

    public root?: IGroup
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
    @opacityType(1)
    public opacity: __Number

    @opacityType(true)
    public visible: __Boolean

    @sortType(0)
    public zIndex: __Number


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

    public draggable: __Boolean

    // ---


    // layer

    @surfaceType() // "pass-through"
    public blendMode: IBlendMode

    @boundsType()
    public mask: __Boolean

    @dataType()
    public locked: __Boolean

    // fill

    @surfaceType()
    public fill: IPaint | IPaint[] | IPaintString

    // border 

    @pathType()
    public borderRadius: __Number | __Number[] | IBorderRadiusString

    @affectEventBoundsType(1)
    public borderWidth: __Number | __Number[] | IBorderWidthString


    // stroke

    @affectEventBoundsType()
    public stroke: IPaint | IPaint[] | IPaintString

    @affectEventBoundsType('center')
    public strokeAlign: IStrokeAlign

    @affectEventBoundsType(1)
    public strokeWidth: __Number

    @surfaceType('none')
    public strokeCap: IStrokeCap

    @surfaceType('miter')
    public strokeJoin: IStrokeJoin

    @surfaceType()
    public dashPattern: __Number[] | IDashPatternString

    @surfaceType()
    public dashOffset: __Number

    @surfaceType(10)
    public miterLimit: __Number


    // corner

    @pathType()
    public cornerRadius: __Number

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


    // now transform

    public get worldTransform(): IMatrixData { return this.__layout.getTransform('world') }

    public get relativeTransform(): IMatrixData { return this.__layout.getTransform('relative') }

    // now bounds

    public get worldBoxBounds(): IBoundsData { return this.__layout.getBounds('world', 'box') }

    public get worldRenderBounds(): IBoundsData { return this.__layout.getBounds('world', 'render') }


    public __updateRenderPath(): void {
        const { __: data } = this
        const { cornerRadius, path } = data
        data.__renderPath = cornerRadius && path ? PathHelper.applyCorner(path, cornerRadius, data.cornerSmoothing) : path
    }

    public __drawRenderPath(canvas: ILeaferCanvas): void {
        canvas.beginPath()
        this.__drawPathByData(canvas, this.__.__renderPath)
    }

    public __drawPath(canvas: ILeaferCanvas): void {
        canvas.beginPath()
        this.__drawPathByData(canvas, this.__.path)
    }

    @rewrite(PathHelper.drawData)
    public __drawPathByData(drawer: ICanvasDrawPath, data: IPathCommandData): void { }

}
