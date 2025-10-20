import { ILeaferCanvas, IRenderOptions } from '@leafer/interface'
import { LeafHelper, isObject } from "@leafer/core"

import { IUI, ILeafPaint } from '@leafer-ui/interface'
import { Paint } from '@leafer-ui/draw'


export function stroke(stroke: string, ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void {
    const data = ui.__
    if (!data.__strokeWidth) return

    if (data.__font) {

        Paint.strokeText(stroke, ui, canvas, renderOptions)

    } else {

        switch (data.strokeAlign) {
            case 'center':
                drawCenter(stroke, 1, ui, canvas, renderOptions)
                break
            case 'inside':
                drawInside(stroke, ui, canvas, renderOptions)
                break
            case 'outside':
                drawOutside(stroke, ui, canvas, renderOptions)
                break
        }

    }
}


export function strokes(strokes: ILeafPaint[], ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void {
    Paint.stroke(strokes as any, ui, canvas, renderOptions)
}


function drawCenter(stroke: string | ILeafPaint[], strokeWidthScale: number, ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions) {
    const data = ui.__
    if (isObject(stroke)) {
        Paint.drawStrokesStyle(stroke, strokeWidthScale, false, ui, canvas, renderOptions)
    } else {
        canvas.setStroke(stroke, data.__strokeWidth * strokeWidthScale, data)
        canvas.stroke()
    }

    if (data.__useArrow) Paint.strokeArrow(stroke, ui, canvas, renderOptions)
}

function drawInside(stroke: string | ILeafPaint[], ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions) {
    canvas.save()
    canvas.clipUI(ui)

    drawCenter(stroke, 2, ui, canvas, renderOptions)
    canvas.restore()
}

function drawOutside(stroke: string | ILeafPaint[], ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions) {
    const data = ui.__
    if (data.__fillAfterStroke) {

        drawCenter(stroke, 2, ui, canvas, renderOptions)

    } else {
        const { renderBounds } = ui.__layout
        const out = canvas.getSameCanvas(true, true)
        ui.__drawRenderPath(out)

        drawCenter(stroke, 2, ui, out, renderOptions)

        out.clipUI(data)
        out.clearWorld(renderBounds)

        LeafHelper.copyCanvasByWorld(ui, canvas, out)

        out.recycle(ui.__nowWorld)
    }
}
