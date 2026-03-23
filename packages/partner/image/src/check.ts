import { ILeaferCanvas, IRenderOptions, IScaleData } from '@leafer/interface'
import { Platform } from '@leafer/core'

import { IUI, ILeafPaint, IImagePaint } from '@leafer-ui/interface'
import { PaintImage } from "@leafer-ui/draw"


export function checkImage(paint: ILeafPaint, drawImage: boolean, ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): boolean {
    const { scaleX, scaleY } = PaintImage.getImageRenderScaleData(paint, ui, canvas, renderOptions), id = paint.film ? paint.nowIndex : scaleX + '-' + scaleY
    const { image, data, originPaint } = paint, { exporting, snapshot } = renderOptions

    if (!data || (paint.patternId === id && !exporting) || snapshot) {
        return false // 生成图案中
    } else {

        if (drawImage) {
            if (data.repeat) {
                drawImage = false
            } else if (!((originPaint as IImagePaint).changeful || paint.film || Platform.name === 'miniapp' || exporting)) { //  小程序直接绘制原图（绕过垃圾回收bug)
                drawImage = Platform.image.isLarge(image, scaleX, scaleY) || image.width * scaleX > 8096 || image.height * scaleY > 8096 // 非image类型的尽量绘制原图，大长图单边超过8096生成pattern会有问题
            }
        }

        if (drawImage) {
            if (ui.__.__isFastShadow) { // fix: 快速阴影时，直接 drawImage 会无阴影，需fill一下
                canvas.fillStyle = paint.style || '#000'
                canvas.fill()
            }
            PaintImage.drawImage(paint, scaleX, scaleY, ui, canvas, renderOptions) // 直接绘制图像，不生成图案
            return true
        } else {
            if (!paint.style || (originPaint as IImagePaint).sync || exporting) PaintImage.createPattern(paint, ui, canvas, renderOptions)
            else PaintImage.createPatternTask(paint, ui, canvas, renderOptions)
            return false
        }
    }
}

export function drawImage(paint: ILeafPaint, imageScaleX: number, imageScaleY: number, ui: IUI, canvas: ILeaferCanvas, _renderOptions: IRenderOptions): void {
    const { data, image, complex } = paint
    let { width, height } = image

    if (complex) {

        const { blendMode, opacity } = paint.originPaint as IImagePaint, { transform } = data
        canvas.save();
        (complex === 2) && canvas.clipUI(ui)
        blendMode && (canvas.blendMode = blendMode)
        opacity && (canvas.opacity *= opacity)
        transform && canvas.transform(transform)
        image.render(canvas, 0, 0, width, height, ui, paint, imageScaleX, imageScaleY) // svg need size
        canvas.restore()

    } else {

        // 简单矩形
        if (data.scaleX) width *= data.scaleX, height *= data.scaleY
        image.render(canvas, 0, 0, width, height, ui, paint, imageScaleX, imageScaleY)

    }
}

export function getImageRenderScaleData(paint: ILeafPaint, ui: IUI, canvas?: ILeaferCanvas, _renderOptions?: IRenderOptions): IScaleData {
    const scaleData = ui.getRenderScaleData(true, paint.originPaint.scaleFixed), { data } = paint
    if (canvas) {
        const { pixelRatio } = canvas
        scaleData.scaleX *= pixelRatio
        scaleData.scaleY *= pixelRatio
    }
    if (data && data.scaleX) {
        scaleData.scaleX *= Math.abs(data.scaleX)
        scaleData.scaleY *= Math.abs(data.scaleY)
    }
    return scaleData
}