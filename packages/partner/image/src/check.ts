import { ILeaferCanvas, IRenderOptions } from '@leafer/interface'
import { Platform, ResizeEvent } from '@leafer/core'

import { IUI, ILeafPaint } from '@leafer-ui/interface'

import { createPatternTask, createPattern } from './pattern'


export function checkImage(paint: ILeafPaint, allowDraw: boolean, ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): boolean {
    const { scaleX, scaleY } = ui.getRenderScaleData(true, paint.scaleFixed)
    const { pixelRatio } = canvas, { data } = paint, { exporting } = renderOptions

    if (!data || (paint.patternId === scaleX + '-' + scaleY + '-' + pixelRatio && !exporting)) {
        return false // 生成图案中
    } else {

        if (allowDraw) {
            if (data.repeat) {
                allowDraw = false
            } else if (!(paint.changeful || (Platform.name === 'miniapp' && ResizeEvent.isResizing(ui)) || exporting)) { //  小程序resize过程中直接绘制原图（绕过垃圾回收bug)
                let { width, height } = data
                width *= scaleX * pixelRatio
                height *= scaleY * pixelRatio
                if (data.scaleX) {
                    width *= data.scaleX
                    height *= data.scaleY
                }
                allowDraw = (width * height > Platform.image.maxCacheSize)
            }
        }

        if (allowDraw) {
            drawImage(paint, ui, canvas) // 直接绘制图像，不生成图案
            return true
        } else {
            if (!paint.style || paint.sync || exporting) {
                createPattern(paint, ui, canvas, renderOptions)
            } else {
                createPatternTask(paint, ui, canvas, renderOptions)
            }
            return false
        }
    }
}

export function drawImage(paint: ILeafPaint, ui: IUI, canvas: ILeaferCanvas): void {
    const { data } = paint

    if (ui.__.__isFastShadow) { // fix: 快速阴影时，直接 drawImage 会无阴影，需fill一下
        canvas.fillStyle = paint.style || '#000'
        canvas.fill()
    }

    canvas.save()
    canvas.clipUI(ui)
    if (paint.blendMode) canvas.blendMode = paint.blendMode
    if (data.opacity) canvas.opacity *= data.opacity
    if (data.transform) canvas.transform(data.transform)
    canvas.drawImage(paint.image.getFull(data.filters), 0, 0, data.width, data.height)
    canvas.restore()
}