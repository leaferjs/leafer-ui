import { ILeaferCanvas } from '@leafer/interface'

import { ILeafPaint, IUI } from '@leafer-ui/interface'

import { drawText } from './FillText'


export function fill(ui: IUI, canvas: ILeaferCanvas, fill: string | object): void {
    canvas.fillStyle = fill
    ui.__.__font ? drawText(ui, canvas) : (ui.__.windingRule ? canvas.fill(ui.__.windingRule) : canvas.fill())
}

export function fills(ui: IUI, canvas: ILeaferCanvas, fills: ILeafPaint[]): void {
    let item: ILeafPaint
    const { windingRule, __font } = ui.__
    for (let i = 0, len = fills.length; i < len; i++) {
        item = fills[i]
        canvas.fillStyle = item.style

        if (item.transform) {
            canvas.save()

            const { a, b, c, d, e, f } = item.transform
            canvas.transform(a, b, c, d, e, f)

            if (item.blendMode) canvas.blendMode = item.blendMode

            __font ? drawText(ui, canvas) : (windingRule ? canvas.fill(windingRule) : canvas.fill())

            canvas.restore()
        } else {
            if (item.blendMode) {
                canvas.saveBlendMode(item.blendMode)

                __font ? drawText(ui, canvas) : (windingRule ? canvas.fill(windingRule) : canvas.fill())

                canvas.restoreBlendMode()
            } else {

                __font ? drawText(ui, canvas) : (windingRule ? canvas.fill(windingRule) : canvas.fill())

            }
        }

    }
}