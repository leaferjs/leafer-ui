import { ILeaferCanvas, IRenderOptions } from '@leafer/interface'
import { DataHelper } from '@leafer/core'

import { IUIRenderModule, ILeafPaint, ILeafStrokePaint, IUI } from '@leafer-ui/interface'
import { Paint, Effect, Filter, ColorConvert } from '@leafer-ui/external'

const { stintSet } = DataHelper

export const UIRender: IUIRenderModule = {

    __updateChange(): void {
        const data = this.__

        if (data.__useEffect) {
            const { shadow, fill, stroke } = data, otherEffect = data.innerShadow || data.blur || data.backgroundBlur || data.filter
            stintSet(data, '__isFastShadow', shadow && !otherEffect && shadow.length < 2 && !shadow[0].spread && !(shadow[0].box && data.__isTransparentFill) && fill && !(fill instanceof Array && fill.length > 1) && (this.useFastShadow || !stroke || (stroke && data.strokeAlign === 'inside')))
            data.__useEffect = !!(shadow || otherEffect)
        }

        stintSet(this.__world, 'half', data.__hasHalf)

        stintSet(data, '__fillAfterStroke', data.stroke && data.strokeAlign === 'outside' && data.fill && !data.__isTransparentFill)

        data.__checkSingle()

        stintSet(data, '__complex', data.__isFills || data.__isStrokes || data.cornerRadius || data.__useEffect)
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

                if (__fillAfterStroke) data.__isStrokes ? Paint.strokes(stroke as ILeafStrokePaint[], this, canvas) : Paint.stroke(stroke as string, this, canvas)

                if (fill) data.__isFills ? Paint.fills(fill as ILeafPaint[], this, canvas) : Paint.fill(fill as string, this, canvas)

                if (__drawAfterFill) this.__drawAfterFill(canvas, options)

                if (innerShadow) Effect.innerShadow(this, canvas, shape)

                if (stroke && !__fillAfterStroke) data.__isStrokes ? Paint.strokes(stroke as ILeafStrokePaint[], this, canvas) : Paint.stroke(stroke as string, this, canvas)

                if (filter) Filter.apply(filter, this, this.__nowWorld, canvas, originCanvas, shape)

                if (shape.worldCanvas) shape.worldCanvas.recycle()
                shape.canvas.recycle()

            } else {

                if (__fillAfterStroke) data.__isStrokes ? Paint.strokes(stroke as ILeafStrokePaint[], this, canvas) : Paint.stroke(stroke as string, this, canvas)

                if (__isFastShadow) {
                    const shadow = data.shadow[0], { scaleX, scaleY } = this.__nowWorld
                    canvas.save(), canvas.setWorldShadow(shadow.x * scaleX, shadow.y * scaleY, shadow.blur * scaleX, ColorConvert.string(shadow.color))
                }

                if (fill) data.__isFills ? Paint.fills(fill as ILeafPaint[], this, canvas) : Paint.fill(fill as string, this, canvas)

                if (__isFastShadow) canvas.restore()

                if (__drawAfterFill) this.__drawAfterFill(canvas, options)

                if (stroke && !__fillAfterStroke) data.__isStrokes ? Paint.strokes(stroke as ILeafStrokePaint[], this, canvas) : Paint.stroke(stroke as string, this, canvas)

            }

        } else {

            if (data.__pathInputed) drawFast(this, canvas, options)
            else this.__drawFast(canvas, options)

        }
    },

    __renderShape(canvas: ILeaferCanvas, options: IRenderOptions, ignoreFill?: boolean, ignoreStroke?: boolean): void {
        if (this.__worldOpacity) {
            canvas.setWorld(this.__nowWorld = this.__getNowWorld(options))

            const { fill, stroke } = this.__

            this.__drawRenderPath(canvas)

            if (fill && !ignoreFill) this.__.__isAlphaPixelFill ? Paint.fills(fill as ILeafPaint[], this, canvas) : Paint.fill('#000000', this, canvas)
            if (this.__.__isCanvas) this.__drawAfterFill(canvas, options)
            if (stroke && !ignoreStroke) this.__.__isAlphaPixelStroke ? Paint.strokes(stroke as ILeafStrokePaint[], this, canvas) : Paint.stroke('#000000', this, canvas)
        }
    },

    __drawAfterFill(canvas: ILeaferCanvas, options: IRenderOptions): void {
        if (this.__.__clipAfterFill) {
            canvas.save()
            canvas.clipUI()
            this.__drawContent(canvas, options)
            canvas.restore()
        } else this.__drawContent(canvas, options)
    }

}


function drawFast(ui: IUI, canvas: ILeaferCanvas, options: IRenderOptions): void {
    const { fill, stroke, __drawAfterFill, __fillAfterStroke } = ui.__

    ui.__drawRenderPath(canvas)

    if (__fillAfterStroke) Paint.stroke(stroke as string, ui, canvas)

    if (fill) Paint.fill(fill as string, ui, canvas)
    if (__drawAfterFill) ui.__drawAfterFill(canvas, options)

    if (stroke && !__fillAfterStroke) Paint.stroke(stroke as string, ui, canvas)
}