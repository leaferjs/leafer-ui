import { ILeaferCanvas, IRenderOptions, IBooleanMap, IBoundsData, ILeaferImage, IAlign, IPointData, IMatrixData, IScaleData, IFunction, ITaskItem } from '@leafer/interface'

import { ILeafPaint, ILeafStrokePaint, ILeafPaintPatternData } from '../type/IComputedType'
import { IUI, IUIData } from '../IUI'
import { ICachedShape } from '../ICachedShape'
import { IGradientPaint, IImagePaint, IPaintAttr } from '../type/IType'


export interface IPaintModule {
    compute(attrName: IPaintAttr, ui: IUI): void

    fill(fill: string, ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void
    fills(fills: ILeafPaint[], ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void

    fillPathOrText(ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void
    fillText(ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void

    stroke(stroke: string, ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void
    strokes(strokes: ILeafPaint[], ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void

    strokeText(stroke: string | ILeafPaint[], ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void
    strokeArrow?(stroke: string | ILeafPaint[], ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void
    drawStrokesStyle(strokes: ILeafStrokePaint[], strokeWidthScale: number, isText: boolean, ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void
    drawTextStroke(ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void

    shape(ui: IUI, current: ILeaferCanvas, renderOptions: IRenderOptions): ICachedShape
}


export interface IPaintImageModule {
    image(ui: IUI, attrName: string, paint: IImagePaint, boxBounds: IBoundsData, firstUse: boolean): ILeafPaint

    checkImage(paint: ILeafPaint, allowDraw: boolean, ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): boolean // 返回true表示已进行了原生绘制
    drawImage(paint: ILeafPaint, imageScaleX: number, imageScaleY: number, ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void
    getImageRenderScaleData(paint: ILeafPaint, ui: IUI, canvas?: ILeaferCanvas, renderOptions?: IRenderOptions): IScaleData // 当前图片渲染的比例数据，必须马上分解使用
    recycleImage(attrName: IPaintAttr, data: IUIData): IBooleanMap

    createPatternTask(paint: ILeafPaint, ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void
    createPattern(paint: ILeafPaint, ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions, resolve?: IFunction, task?: ITaskItem): void
    getPatternFixScale(paint: ILeafPaint, imageScaleX: number, imageScaleY: number): number

    createData(leafPaint: ILeafPaint, image: ILeaferImage, paint: IImagePaint, box: IBoundsData): void
    getPatternData(paint: IImagePaint, box: IBoundsData, image: ILeaferImage): ILeafPaintPatternData

    stretchMode(data: ILeafPaintPatternData, box: IBoundsData, scaleX: number, scaleY: number): void
    fillOrFitMode(data: ILeafPaintPatternData, box: IBoundsData, x: number, y: number, scaleX: number, scaleY: number, rotation: number): void
    clipMode(data: ILeafPaintPatternData, box: IBoundsData, x: number, y: number, scaleX: number, scaleY: number, rotation: number, skew: IPointData, clipScaleX?: number, clipScaleY?: number): void
    repeatMode(data: ILeafPaintPatternData, box: IBoundsData, width: number, height: number, x: number, y: number, scaleX: number, scaleY: number, rotation: number, skew: IPointData, align: IAlign, freeTransform?: boolean): void
}

export interface IPaintGradientModule {
    linearGradient(paint: IGradientPaint, box: IBoundsData): ILeafPaint
    radialGradient(paint: IGradientPaint, box: IBoundsData): ILeafPaint
    conicGradient(paint: IGradientPaint, box: IBoundsData): ILeafPaint
    getTransform(box: IBoundsData, from: IPointData, to: IPointData, stretch: number, rotate90: boolean): IMatrixData
}