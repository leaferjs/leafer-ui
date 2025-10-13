import { ILeaferCanvas, IRenderOptions } from '@leafer/interface'

import { ILeafPaint, IUI } from '@leafer-ui/interface'
import { PaintImage } from "@leafer-ui/draw"

import { fillText } from './FillText'


export function fill(fill: string, ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void {
    canvas.fillStyle = fill
    fillPathOrText(ui, canvas, renderOptions)
}


export function fills(fills: ILeafPaint[], ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void {
    let item: ILeafPaint
    for (let i = 0, len = fills.length; i < len; i++) {
        item = fills[i]

        if (item.image) {

            if (PaintImage.checkImage(item, !ui.__.__font, ui, canvas, renderOptions)) continue

            if (!item.style) {
                if (!i && item.image.isPlacehold) ui.drawImagePlaceholder(item.image, canvas, renderOptions) // 图片加载中或加载失败
                continue
            }

        }

        canvas.fillStyle = item.style

        if (item.transform || item.scaleFixed) {

            canvas.save()
            if (item.transform) canvas.transform(item.transform)
            if (item.scaleFixed) {
                const { scaleX, scaleY } = ui.getRenderScaleData(true)
                if (item.scaleFixed === true || (item.scaleFixed === 'zoom-in' && scaleX > 1 && scaleY > 1)) canvas.scale(1 / scaleX, 1 / scaleY)
            }
            if (item.blendMode) canvas.blendMode = item.blendMode
            fillPathOrText(ui, canvas, renderOptions)
            canvas.restore()

        } else {

            if (item.blendMode) {

                canvas.saveBlendMode(item.blendMode)
                fillPathOrText(ui, canvas, renderOptions)
                canvas.restoreBlendMode()

            } else fillPathOrText(ui, canvas, renderOptions)

        }

    }
}


export function fillPathOrText(ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void {
    ui.__.__font ? fillText(ui, canvas, renderOptions) : (ui.__.windingRule ? canvas.fill(ui.__.windingRule) : canvas.fill())
}