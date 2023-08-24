import { ILeaferCanvas } from '@leafer/interface'

import { IUI, ILeafPaint } from '@leafer-ui/interface'

import { strokeText, drawStrokesStyle } from './StrokeText'


export function stroke(ui: IUI, canvas: ILeaferCanvas, stroke: string): void {
    const options = ui.__
    const { strokeWidth, strokeAlign, __font } = options
    if (!strokeWidth) return

    if (__font) {

        strokeText(ui, canvas, stroke)

    } else {

        switch (strokeAlign) {

            case 'center':

                canvas.setStroke(stroke, strokeWidth, options)
                canvas.stroke()
                break

            case 'inside':

                canvas.save()
                canvas.setStroke(stroke, strokeWidth * 2, options)

                canvas.clip(options.windingRule)
                canvas.stroke()

                canvas.restore()

                break

            case 'outside':
                const out = canvas.getSameCanvas(true)
                out.setStroke(stroke, strokeWidth * 2, ui.__)

                ui.__drawRenderPath(out)

                out.stroke()

                out.clip(options.windingRule)
                out.clearWorld(ui.__layout.renderBounds)

                canvas.copyWorldToInner(out, ui.__world, ui.__layout.renderBounds)
                out.recycle()

                break
        }

    }
}


export function strokes(ui: IUI, canvas: ILeaferCanvas, strokes: ILeafPaint[]): void {
    const options = ui.__
    const { strokeWidth, strokeAlign, __font } = options
    if (!strokeWidth) return

    if (__font) {

        strokeText(ui, canvas, strokes)

    } else {

        switch (strokeAlign) {

            case 'center':
                canvas.setStroke(undefined, strokeWidth, options)
                drawStrokesStyle(ui, strokes, canvas)
                break

            case 'inside':
                canvas.save()
                canvas.setStroke(undefined, strokeWidth * 2, options)
                canvas.clip(options.windingRule)

                drawStrokesStyle(ui, strokes, canvas)

                canvas.restore()
                break

            case 'outside':
                const { renderBounds } = ui.__layout
                const out = canvas.getSameCanvas(true)
                ui.__drawRenderPath(out)

                out.setStroke(undefined, strokeWidth * 2, ui.__)

                drawStrokesStyle(ui, strokes, out)

                out.clip(options.windingRule)
                out.clearWorld(renderBounds)

                canvas.copyWorldToInner(out, ui.__world, renderBounds)
                out.recycle()
                break
        }

    }

}
