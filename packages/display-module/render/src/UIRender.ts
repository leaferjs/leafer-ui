import { ILeaferCanvas, IRenderOptions } from '@leafer/interface'
import { DataHelper, isArray } from '@leafer/core'

import { IUIRenderModule, ILeafPaint, ILeafStrokePaint, IUI } from '@leafer-ui/interface'
import { Paint, Effect, Filter, ColorConvert } from '@leafer-ui/external'

const { stintSet } = DataHelper

export const UIRender: IUIRenderModule = {

    __updateChange(): void {
        const data = this.__

        if (data.__useStroke) {
            const useStroke = data.__useStroke = !!(data.stroke && data.strokeWidth)
            stintSet(this.__world, 'half', useStroke && data.strokeAlign === 'center' && data.strokeWidth % 2)  // 是否存在半逻辑像素渲染（奇数线宽的居中线条），可以半像素为起点绘制，防止模糊
            stintSet(data, '__fillAfterStroke', useStroke && data.strokeAlign === 'outside' && data.fill && !data.__isTransparentFill)
        }

        if (data.__useEffect) {
            const { shadow, fill, stroke } = data, otherEffect = data.innerShadow || data.blur || data.backgroundBlur || data.filter
            stintSet(data, '__isFastShadow', shadow && !otherEffect && shadow.length < 2 && !shadow[0].spread && !Effect.isTransformShadow(shadow[0]) && fill && !data.__isTransparentFill && !(isArray(fill) && fill.length > 1) && (this.useFastShadow || !stroke || (stroke && data.strokeAlign === 'inside'))) // 高性能阴影条件， @leafer-ui/image check.ts 中的 allowDraw 逻辑需与此处关联
            data.__useEffect = !!(shadow || otherEffect)
        }

        data.__checkSingle()

        stintSet(data, '__complex', (data.__isFills || data.__isStrokes || data.cornerRadius || data.__useEffect) as boolean)
    },

    __drawFast(canvas: ILeaferCanvas, options: IRenderOptions): void {
        drawFast(this, canvas, options)
    },

    __draw(canvas: ILeaferCanvas, options: IRenderOptions, originCanvas?: ILeaferCanvas): void {
        const data = this.__

        if (data.__complex) {

            if (data.__needComputePaint) data.__computePaint()

            const { fill, stroke, __drawAfterFill, __fillAfterStroke, __isFastShadow } = data

            this.__drawRenderPath(canvas)

            if (data.__useEffect && !__isFastShadow) {

                const shape = Paint.shape(this, canvas, options)
                this.__nowWorld = this.__getNowWorld(options) // restore

                const { shadow, innerShadow, filter } = data

                if (shadow) Effect.shadow(this, canvas, shape)

                if (__fillAfterStroke) data.__isStrokes ? Paint.strokes(stroke as ILeafStrokePaint[], this, canvas, options) : Paint.stroke(stroke as string, this, canvas, options)

                if (fill) data.__isFills ? Paint.fills(fill as ILeafPaint[], this, canvas, options) : Paint.fill(fill as string, this, canvas, options)

                if (__drawAfterFill) this.__drawAfterFill(canvas, options)

                if (innerShadow) Effect.innerShadow(this, canvas, shape)

                if (stroke && !__fillAfterStroke) data.__isStrokes ? Paint.strokes(stroke as ILeafStrokePaint[], this, canvas, options) : Paint.stroke(stroke as string, this, canvas, options)

                if (filter) Filter.apply(filter, this, this.__nowWorld, canvas, originCanvas, shape)

                if (shape.worldCanvas) shape.worldCanvas.recycle()
                shape.canvas.recycle()

            } else {

                if (__fillAfterStroke) data.__isStrokes ? Paint.strokes(stroke as ILeafStrokePaint[], this, canvas, options) : Paint.stroke(stroke as string, this, canvas, options)

                if (__isFastShadow) {
                    const shadow = data.shadow[0], { scaleX, scaleY } = this.getRenderScaleData(true, shadow.scaleFixed)
                    canvas.save(), canvas.setWorldShadow(shadow.x * scaleX, shadow.y * scaleY, shadow.blur * scaleX, ColorConvert.string(shadow.color))
                }

                if (fill) data.__isFills ? Paint.fills(fill as ILeafPaint[], this, canvas, options) : Paint.fill(fill as string, this, canvas, options)

                if (__isFastShadow) canvas.restore()

                if (__drawAfterFill) this.__drawAfterFill(canvas, options)

                if (stroke && !__fillAfterStroke) data.__isStrokes ? Paint.strokes(stroke as ILeafStrokePaint[], this, canvas, options) : Paint.stroke(stroke as string, this, canvas, options)

            }

        } else {

            if (data.__pathForRender) drawFast(this, canvas, options)
            else this.__drawFast(canvas, options)

        }
    },

    __drawShape(canvas: ILeaferCanvas, options: IRenderOptions): void {
        this.__drawRenderPath(canvas)

        const data = this.__, { fill, stroke } = data

        if (fill && !options.ignoreFill) data.__isAlphaPixelFill ? Paint.fills(fill as ILeafPaint[], this, canvas, options) : Paint.fill('#000000', this, canvas, options)
        if (data.__isCanvas) this.__drawAfterFill(canvas, options)
        if (stroke && !options.ignoreStroke) data.__isAlphaPixelStroke ? Paint.strokes(stroke as ILeafStrokePaint[], this, canvas, options) : Paint.stroke('#000000', this, canvas, options)
    },

    __drawAfterFill(canvas: ILeaferCanvas, options: IRenderOptions): void {
        if (this.__.__clipAfterFill) {
            canvas.save()
            canvas.clipUI(this)
            this.__drawContent(canvas, options)
            canvas.restore()
        } else this.__drawContent(canvas, options)
    }

}


function drawFast(ui: IUI, canvas: ILeaferCanvas, options: IRenderOptions): void {
    const { fill, stroke, __drawAfterFill, __fillAfterStroke } = ui.__

    ui.__drawRenderPath(canvas)

    if (__fillAfterStroke) Paint.stroke(stroke as string, ui, canvas, options)

    if (fill) Paint.fill(fill as string, ui, canvas, options)
    if (__drawAfterFill) ui.__drawAfterFill(canvas, options)

    if (stroke && !__fillAfterStroke) Paint.stroke(stroke as string, ui, canvas, options)
}