import { ILeaferCanvas } from '@leafer/interface'

import { ILeafPaint, IUI } from '@leafer-ui/interface'

import { checkImage } from './paint/image'
import { fillText } from './FillText'


export function fill(fill: string, ui: IUI, canvas: ILeaferCanvas): void {
    canvas.fillStyle = fill
    ui.__.__font ? fillText(ui, canvas) : (ui.__.windingRule ? canvas.fill(ui.__.windingRule) : canvas.fill())
}


export function fills(fills: ILeafPaint[], ui: IUI, canvas: ILeaferCanvas): void {
    let item: ILeafPaint
    const { windingRule, __font } = ui.__
    for (let i = 0, len = fills.length; i < len; i++) {
        item = fills[i]

        if (item.image && checkImage(ui, canvas, item, !__font)) continue

        if (item.style) {

            canvas.fillStyle = item.style

            if (item.transform) {
                canvas.save()

                canvas.transform(item.transform)

                if (item.blendMode) canvas.blendMode = item.blendMode

                __font ? fillText(ui, canvas) : (windingRule ? canvas.fill(windingRule) : canvas.fill())

                canvas.restore()
            } else {
                if (item.blendMode) {
                    canvas.saveBlendMode(item.blendMode)

                    __font ? fillText(ui, canvas) : (windingRule ? canvas.fill(windingRule) : canvas.fill())

                    canvas.restoreBlendMode()
                } else {

                    __font ? fillText(ui, canvas) : (windingRule ? canvas.fill(windingRule) : canvas.fill())

                }
            }
        }

    }
}