import { ILeaferCanvas } from '@leafer/interface'

import { IUI, ILeafPaint } from '@leafer-ui/interface'

import { strokeText, drawStrokesStyle } from './StrokeText'


export function stroke(stroke: string, ui: IUI, canvas: ILeaferCanvas): void {
    const options = ui.__
    const { __strokeWidth, strokeAlign, __font } = options
    if (!__strokeWidth) return

    if (__font) {

        strokeText(stroke, ui, canvas)

    } else {

        switch (strokeAlign) {

            case 'center':

                canvas.setStroke(stroke, __strokeWidth, options)
                canvas.stroke()
                break

            case 'inside':

                canvas.save()
                canvas.setStroke(stroke, __strokeWidth * 2, options)

                options.windingRule ? canvas.clip(options.windingRule) : canvas.clip()
                canvas.stroke()

                canvas.restore()

                break

            case 'outside':
                const out = canvas.getSameCanvas(true, true)
                out.setStroke(stroke, __strokeWidth * 2, options)

                ui.__drawRenderPath(out)

                out.stroke()

                options.windingRule ? out.clip(options.windingRule) : out.clip()
                out.clearWorld(ui.__layout.renderBounds)

                if (ui.__worldFlipped) {
                    canvas.copyWorldByReset(out, ui.__nowWorld)
                } else {
                    canvas.copyWorldToInner(out, ui.__nowWorld, ui.__layout.renderBounds)
                }

                out.recycle(ui.__nowWorld)
                break
        }

    }
}


export function strokes(strokes: ILeafPaint[], ui: IUI, canvas: ILeaferCanvas): void {
    const options = ui.__
    const { __strokeWidth, strokeAlign, __font } = options
    if (!__strokeWidth) return

    if (__font) {

        strokeText(strokes, ui, canvas)

    } else {

        switch (strokeAlign) {

            case 'center':
                canvas.setStroke(undefined, __strokeWidth, options)
                drawStrokesStyle(strokes, false, ui, canvas)
                break

            case 'inside':
                canvas.save()
                canvas.setStroke(undefined, __strokeWidth * 2, options)
                options.windingRule ? canvas.clip(options.windingRule) : canvas.clip()

                drawStrokesStyle(strokes, false, ui, canvas)

                canvas.restore()
                break

            case 'outside':
                const { renderBounds } = ui.__layout
                const out = canvas.getSameCanvas(true, true)
                ui.__drawRenderPath(out)

                out.setStroke(undefined, __strokeWidth * 2, options)

                drawStrokesStyle(strokes, false, ui, out)

                options.windingRule ? out.clip(options.windingRule) : out.clip()
                out.clearWorld(renderBounds)

                if (ui.__worldFlipped) {
                    canvas.copyWorldByReset(out, ui.__nowWorld)
                } else {
                    canvas.copyWorldToInner(out, ui.__nowWorld, renderBounds)
                }

                out.recycle(ui.__nowWorld)
                break
        }

    }

}
