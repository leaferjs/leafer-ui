import { ILeaferCanvas, IRenderOptions } from '@leafer/interface'

import { IUIRenderModule, ILeafPaint, ILeafStrokePaint } from '@leafer-ui/interface'
import { Paint, Effect } from '@leafer-ui/external'


export const UIRender: IUIRenderModule = {

    __updateChange(): void {
        let data = this.__

        if (data.__useEffect) {
            const { shadow, innerShadow, blur, backgroundBlur } = this.__
            data.__useEffect = !!(shadow || innerShadow || blur || backgroundBlur)
        }

        let complex = data.__isFills || data.__isStrokes || data.cornerRadius || data.__useEffect || (data.blendMode && data.blendMode !== 'pass-through')

        if (complex) {
            data.__complex = true
        } else {
            data.__complex && (data.__complex = false)
        }
    },

    __drawFast(canvas: ILeaferCanvas, options: IRenderOptions): void {
        const { fill, stroke, __drawAfterFill } = this.__

        this.__drawRenderPath(canvas)

        if (fill) Paint.fill(this, canvas, fill)
        if (__drawAfterFill) this.__drawAfterFill(canvas, options)
        if (stroke) Paint.stroke(this, canvas, stroke)
    },

    __draw(canvas: ILeaferCanvas, options: IRenderOptions): void {

        if (this.__.__complex) {

            const { fill, stroke, __drawAfterFill, __blendLayer } = this.__

            let orginCanvas: ILeaferCanvas

            if (__blendLayer) {
                orginCanvas = canvas
                canvas = canvas.getSameCanvas(true)
            }

            this.__drawRenderPath(canvas)

            if (this.__.__useEffect) {

                const shape = Paint.shape(this, canvas, options)

                const { shadow, innerShadow } = this.__

                if (shadow) Effect.shadow(this, canvas, shape)

                if (fill) this.__.__isFills ? Paint.fills(this, canvas, fill as ILeafPaint[]) : Paint.fill(this, canvas, fill)

                if (__drawAfterFill) this.__drawAfterFill(canvas, options)

                if (innerShadow) Effect.innerShadow(this, canvas, shape)

                if (stroke) this.__.__isStrokes ? Paint.strokes(this, canvas, stroke as ILeafStrokePaint[]) : Paint.stroke(this, canvas, stroke)

                if (shape.worldCanvas) shape.worldCanvas.recycle()
                shape.canvas.recycle()

            } else {

                if (fill) this.__.__isFills ? Paint.fills(this, canvas, fill as ILeafPaint[]) : Paint.fill(this, canvas, fill)
                if (__drawAfterFill) this.__drawAfterFill(canvas, options)
                if (stroke) this.__.__isStrokes ? Paint.strokes(this, canvas, stroke as ILeafStrokePaint[]) : Paint.stroke(this, canvas, stroke)

            }

            if (orginCanvas) {
                orginCanvas.copyWorldToInner(canvas, this.__world, this.__layout.renderBounds, this.__.blendMode)
                canvas.recycle()
            }


        } else {

            this.__drawFast(canvas, options)

        }
    },

    __renderShape(canvas: ILeaferCanvas, options: IRenderOptions): void {
        if (!this.__worldOpacity) return

        canvas.setWorld(this.__world, options.matrix)

        const { fill, stroke } = this.__

        this.__drawRenderPath(canvas)

        if (fill) Paint.fill(this, canvas, '#000000')
        if (stroke) Paint.stroke(this, canvas, '#000000')
    }

}