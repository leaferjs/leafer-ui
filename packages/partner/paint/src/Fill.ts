import { ILeaferCanvas, IRenderOptions } from '@leafer/interface'

import { IImagePaint, ILeafPaint, IUI } from '@leafer-ui/interface'
import { PaintImage, Paint } from "@leafer-ui/draw"


export function fill(fill: string, ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void {
    canvas.fillStyle = fill
    fillPathOrText(ui, canvas, renderOptions)
}


export function fills(fills: ILeafPaint[], ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void {
    let item: ILeafPaint, originPaint: IImagePaint, countImage: number
    for (let i = 0, len = fills.length; i < len; i++) {
        item = fills[i], originPaint = item.originPaint as IImagePaint

        if (item.image) {

            countImage ? countImage++ : countImage = 1

            if (PaintImage.checkImage(item, !ui.__.__font, ui, canvas, renderOptions)) continue

            if (!item.style) {
                if (countImage === 1 && item.image.isPlacehold) ui.drawImagePlaceholder(item, canvas, renderOptions) // 图片加载中或加载失败
                continue
            }

        }

        canvas.fillStyle = item.style

        if (item.transform || originPaint.scaleFixed) {

            canvas.save()
            if (item.transform) canvas.transform(item.transform)
            if (originPaint.scaleFixed) {
                const { scaleX, scaleY } = ui.getRenderScaleData(true)
                if (originPaint.scaleFixed === true || (originPaint.scaleFixed === 'zoom-in' && scaleX > 1 && scaleY > 1)) canvas.scale(1 / scaleX, 1 / scaleY)
            }
            if (originPaint.blendMode) canvas.blendMode = originPaint.blendMode
            fillPathOrText(ui, canvas, renderOptions)
            canvas.restore()

        } else {

            if (originPaint.blendMode) {

                canvas.saveBlendMode(originPaint.blendMode)
                fillPathOrText(ui, canvas, renderOptions)
                canvas.restoreBlendMode()

            } else fillPathOrText(ui, canvas, renderOptions)

        }

    }
}


export function fillPathOrText(ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): void {
    ui.__.__font ? Paint.fillText(ui, canvas, renderOptions) : (ui.__.windingRule ? canvas.fill(ui.__.windingRule) : canvas.fill())
}