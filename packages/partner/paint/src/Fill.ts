import { ILeaferCanvas } from '@leafer/interface'

import { ILeafPaint, IUI } from '@leafer-ui/interface'
import { PaintImage } from "@leafer-ui/draw"

import { fillText } from './FillText'


export function fill(fill: string, ui: IUI, canvas: ILeaferCanvas): void {
    canvas.fillStyle = fill
    fillPathOrText(ui, canvas)
}


export function fills(fills: ILeafPaint[], ui: IUI, canvas: ILeaferCanvas): void {
    let item: ILeafPaint
    for (let i = 0, len = fills.length; i < len; i++) {
        item = fills[i]

        if (item.image) {

            if (PaintImage.checkImage(ui, canvas, item, !ui.__.__font)) continue

            if (!item.style) {
                if (!i && item.image.isPlacehold) ui.drawImagePlaceholder(canvas, item.image) // 图片加载中或加载失败
                continue
            }

        }

        canvas.fillStyle = item.style

        if (item.transform) {

            canvas.save()
            canvas.transform(item.transform)
            if (item.blendMode) canvas.blendMode = item.blendMode
            fillPathOrText(ui, canvas)
            canvas.restore()

        } else {

            if (item.blendMode) {

                canvas.saveBlendMode(item.blendMode)
                fillPathOrText(ui, canvas)
                canvas.restoreBlendMode()

            } else fillPathOrText(ui, canvas)

        }

    }
}


export function fillPathOrText(ui: IUI, canvas: ILeaferCanvas): void {
    ui.__.__font ? fillText(ui, canvas) : (ui.__.windingRule ? canvas.fill(ui.__.windingRule) : canvas.fill())
}