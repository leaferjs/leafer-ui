import { ILeaferCanvas, IRenderOptions } from '@leafer/interface'

import { IUIRenderModule, ILeafPaint, ILeafStrokePaint } from '@leafer-ui/interface'
import { Paint, Effect } from '@leafer-ui/external'


export const UIRender: IUIRenderModule = {

    __updateChange(): void {
        const data = this.__

        if (data.__useEffect) {
            const { shadow, innerShadow, blur, backgroundBlur } = this.__
            data.__useEffect = !!(shadow || innerShadow || blur || backgroundBlur)
        }

        data.__checkSingle()

        const complex = data.__isFills || data.__isStrokes || data.cornerRadius || data.__useEffect

        if (complex) {
            data.__complex = true
        } else {
            data.__complex && (data.__complex = false)
        }
    },

    __drawFast(canvas: ILeaferCanvas, options: IRenderOptions): void {
        const { fill, stroke, __drawAfterFill } = this.__

        this.__drawRenderPath(canvas)

        if (fill) Paint.fill(fill as string, this, canvas)
        if (__drawAfterFill) this.__drawAfterFill(canvas, options)
        if (stroke) Paint.stroke(stroke as string, this, canvas)
    },

    __draw(canvas: ILeaferCanvas, options: IRenderOptions): void {

        if (this.__.__complex) {

            const data = this.__

            if (data.__needComputePaint) data.__computePaint()

            const { fill, stroke, __drawAfterFill } = data

            this.__drawRenderPath(canvas)

            if (data.__useEffect) {

                const shape = Paint.shape(this, canvas, options)
                this.__nowWorld = this.__getRenderWorld(options) // restore

                const { shadow, innerShadow } = data

                if (shadow) Effect.shadow(this, canvas, shape)

                if (fill) data.__isFills ? Paint.fills(fill as ILeafPaint[], this, canvas) : Paint.fill(fill as string, this, canvas)

                if (__drawAfterFill) this.__drawAfterFill(canvas, options)

                if (innerShadow) Effect.innerShadow(this, canvas, shape)

                if (stroke) data.__isStrokes ? Paint.strokes(stroke as ILeafStrokePaint[], this, canvas) : Paint.stroke(stroke as string, this, canvas)

                if (shape.worldCanvas) shape.worldCanvas.recycle()
                shape.canvas.recycle()

            } else {

                if (fill) data.__isFills ? Paint.fills(fill as ILeafPaint[], this, canvas) : Paint.fill(fill as string, this, canvas)
                if (__drawAfterFill) this.__drawAfterFill(canvas, options)
                if (stroke) data.__isStrokes ? Paint.strokes(stroke as ILeafStrokePaint[], this, canvas) : Paint.stroke(stroke as string, this, canvas)

            }

        } else {

            this.__drawFast(canvas, options)

        }
    },

    __renderShape(canvas: ILeaferCanvas, options: IRenderOptions): void {
        if (this.__worldOpacity) {
            canvas.setWorld(this.__nowWorld = this.__getRenderWorld(options))

            const { fill, stroke } = this.__

            this.__drawRenderPath(canvas)

            if (fill) this.__.__pixelFill ? Paint.fills(fill as ILeafPaint[], this, canvas) : Paint.fill('#000000', this, canvas)
            if (stroke) this.__.__pixelStroke ? Paint.strokes(stroke as ILeafStrokePaint[], this, canvas) : Paint.stroke('#000000', this, canvas)
        }
    }

}