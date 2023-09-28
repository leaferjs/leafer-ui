import { ILeaferCanvas, IRenderOptions } from '@leafer/interface'

import { IUI, ILeafPaint } from '@leafer-ui/interface'

import { strokeText, drawStrokesStyle } from './StrokeText'


export function stroke(stroke: string, ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void {
    const options = ui.__
    const { strokeWidth, strokeAlign, __font } = options
    if (!strokeWidth) return

    if (__font) {

        strokeText(stroke, ui, canvas, renderOptions)

    } else {

        switch (strokeAlign) {

            case 'center':

                canvas.setStroke(stroke, strokeWidth, options)
                canvas.stroke()
                break

            case 'inside':

                canvas.save()
                canvas.setStroke(stroke, strokeWidth * 2, options)

                options.windingRule ? canvas.clip(options.windingRule) : canvas.clip()
                canvas.stroke()

                canvas.restore()

                break

            case 'outside':
                const out = canvas.getSameCanvas(true)
                out.setStroke(stroke, strokeWidth * 2, ui.__)

                ui.__drawRenderPath(out)

                out.stroke()

                options.windingRule ? out.clip(options.windingRule) : out.clip()
                out.clearWorld(ui.__layout.renderBounds)

                if (ui.__hasMirror || renderOptions.matrix) {
                    canvas.copyWorldByReset(out)
                } else {
                    canvas.copyWorldToInner(out, ui.__world, ui.__layout.renderBounds)
                }

                out.recycle()

                break
        }

    }
}


export function strokes(strokes: ILeafPaint[], ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void {
    const options = ui.__
    const { strokeWidth, strokeAlign, __font } = options
    if (!strokeWidth) return

    if (__font) {

        strokeText(strokes, ui, canvas, renderOptions)

    } else {

        switch (strokeAlign) {

            case 'center':
                canvas.setStroke(undefined, strokeWidth, options)
                drawStrokesStyle(strokes, false, ui, canvas)
                break

            case 'inside':
                canvas.save()
                canvas.setStroke(undefined, strokeWidth * 2, options)
                options.windingRule ? canvas.clip(options.windingRule) : canvas.clip()

                drawStrokesStyle(strokes, false, ui, canvas)

                canvas.restore()
                break

            case 'outside':
                const { renderBounds } = ui.__layout
                const out = canvas.getSameCanvas(true)
                ui.__drawRenderPath(out)

                out.setStroke(undefined, strokeWidth * 2, ui.__)

                drawStrokesStyle(strokes, false, ui, out)

                options.windingRule ? out.clip(options.windingRule) : out.clip()
                out.clearWorld(renderBounds)

                if (ui.__hasMirror || renderOptions.matrix) {
                    canvas.copyWorldByReset(out)
                } else {
                    canvas.copyWorldToInner(out, ui.__world, renderBounds)
                }

                out.recycle()
                break
        }

    }

}
