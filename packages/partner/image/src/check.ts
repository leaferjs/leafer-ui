import { ILeaferCanvas, IRenderOptions, IScaleData } from '@leafer/interface'
import { Platform, ResizeEvent } from '@leafer/core'

import { IUI, ILeafPaint, IImagePaint } from '@leafer-ui/interface'
import { PaintImage } from "@leafer-ui/draw"


export function checkImage(paint: ILeafPaint, drawImage: boolean, ui: IUI, canvas: ILeaferCanvas, renderOptions: IRenderOptions): boolean {
    const { scaleX, scaleY } = PaintImage.getImageRenderScaleData(paint, ui, canvas, renderOptions)
    const { image, data, originPaint } = paint, { exporting, snapshot } = renderOptions

    if (!data || (paint.patternId === scaleX + '-' + scaleY && !exporting) || snapshot) {
        return false // 生成图案中
    } else {

        if (drawImage) {
            if (data.repeat) {
                drawImage = false
            } else if (!((originPaint as IImagePaint).changeful || (Platform.name === 'miniapp' && ResizeEvent.isResizing(ui)) || exporting)) { //  小程序resize过程中直接绘制原图（绕过垃圾回收bug)
                drawImage = Platform.image.isLarge(image, scaleX, scaleY) || image.width * scaleX > 8096 || image.height * scaleY > 8096 // 大长图单边超过8096生成pattern会有问题
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

export function drawImage(paint: ILeafPaint, _imageScaleX: number, _imageScaleY: number, ui: IUI, canvas: ILeaferCanvas, _renderOptions: IRenderOptions): void {
    const { data, image } = paint, { blendMode } = paint.originPaint as IImagePaint, { opacity, transform } = data, view = image.getFull(data.filters), u = ui.__
    let { width, height } = image, clipUI: any

    if ((clipUI = (transform && !transform.onlyScale) || u.path || u.cornerRadius) || opacity || blendMode) {
        canvas.save()
        clipUI && canvas.clipUI(ui)
        blendMode && (canvas.blendMode = blendMode)
        opacity && (canvas.opacity *= opacity)
        transform && canvas.transform(transform)
        canvas.drawImage(view, 0, 0, width, height) // svg need size
        canvas.restore()
    } else { // 简单矩形
        if (data.scaleX) width *= data.scaleX, height *= data.scaleY
        canvas.drawImage(view, 0, 0, width, height)
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