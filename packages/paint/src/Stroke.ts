import { ILeaferCanvas } from '@leafer/interface'

import { IUI, ILeafStrokePaint, ILeafPaint } from '@leafer-ui/interface'


export function stroke(ui: IUI, canvas: ILeaferCanvas, stroke: string | object): void {
    const options = ui.__
    const { strokeWidth, strokeAlign } = options

    switch (strokeAlign) {

        case 'center':
            canvas.setStroke(undefined, strokeWidth, options)
            canvas.strokeStyle = stroke
            canvas.stroke()
            break

        case 'inside':
            canvas.save()
            canvas.setStroke(undefined, strokeWidth * 2, options)
            canvas.clip(options.windingRule)

            canvas.strokeStyle = stroke
            canvas.stroke()

            canvas.restore()
            break

        case 'outside':
            const out = canvas.getSameCanvas(true)
            ui.__drawRenderPath(out)

            out.setStroke(undefined, strokeWidth * 2, ui.__)

            out.strokeStyle = stroke
            out.stroke()

            out.clip(options.windingRule)
            out.clearBounds(ui.__layout.renderBounds)

            canvas.copyWorldToLocal(out, ui.__world, ui.__layout.renderBounds)
            out.recycle()
            break
    }

}

export function strokes(ui: IUI, canvas: ILeaferCanvas, strokes: ILeafPaint[]): void {
    const options = ui.__
    const { strokeWidth, strokeAlign } = options

    switch (strokeAlign) {

        case 'center':
            canvas.setStroke(undefined, strokeWidth, options)
            drawStrokesStyle(strokes, canvas)
            break

        case 'inside':
            canvas.save()
            canvas.setStroke(undefined, strokeWidth * 2, options)
            canvas.clip(options.windingRule)

            drawStrokesStyle(strokes, canvas)

            canvas.restore()
            break

        case 'outside':
            const { renderBounds } = ui.__layout
            const out = canvas.getSameCanvas(true)
            ui.__drawRenderPath(out)

            out.setStroke(undefined, strokeWidth * 2, ui.__)

            drawStrokesStyle(strokes, out)

            out.clip(options.windingRule)
            out.clearBounds(renderBounds)

            canvas.copyWorldToLocal(out, ui.__world, renderBounds)
            out.recycle()
            break
    }

}

function drawStrokesStyle(strokes: ILeafStrokePaint[], canvas: ILeaferCanvas): void {
    strokes.forEach((item: ILeafStrokePaint) => {
        canvas.strokeStyle = item.style
        canvas.stroke()
    })
}