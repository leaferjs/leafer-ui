import { IBlendMode, ILeaf, ILeaferCanvas, IMaskType, IRenderOptions } from '@leafer/interface'
import { LeafBoundsHelper } from '@leafer/core'

import { Group } from '@leafer-ui/draw'


type IMaskMode = 'path' | 'alpha' | 'grayscale' | 'opacity-path'
const { excludeRenderBounds } = LeafBoundsHelper
let usedGrayscaleAlpha: boolean

Group.prototype.__renderMask = function (canvas: ILeaferCanvas, options: IRenderOptions): void {

    let child: ILeaf, maskCanvas: ILeaferCanvas, contentCanvas: ILeaferCanvas, maskOpacity: number, currentMask: IMaskMode, mask: boolean | IMaskType
    const { children } = this

    for (let i = 0, len = children.length; i < len; i++) {
        child = children[i], mask = child.__.mask

        if (mask) {

            if (currentMask) {
                maskEnd(this, currentMask, canvas, contentCanvas, maskCanvas, maskOpacity, undefined, true)
                maskCanvas = contentCanvas = null
            }

            // mask start

            if (mask === 'clipping' || mask === 'clipping-path') excludeRenderBounds(child, options) || child.__render(canvas, options) // 剪贴蒙版，需要渲染自身到原画布中，如果应用遮罩会造成透明度减半。clipping-path 支持渲染外描边。

            maskOpacity = child.__.opacity
            usedGrayscaleAlpha = false

            if (mask === 'path' || mask === 'clipping-path') {

                if (maskOpacity < 1) {

                    currentMask = 'opacity-path'
                    if (!contentCanvas) contentCanvas = getCanvas(canvas)

                } else {
                    currentMask = 'path'
                    canvas.save()
                }

                child.__clip(contentCanvas || canvas, options)

            } else { // pixel

                currentMask = mask === 'grayscale' ? 'grayscale' : 'alpha'
                if (!maskCanvas) maskCanvas = getCanvas(canvas)
                if (!contentCanvas) contentCanvas = getCanvas(canvas)
                child.__render(maskCanvas, options)

            }

            continue
        }

        const childBlendMode = maskOpacity === 1 && child.__.__blendMode

        // 元素存在混合模式，将先前的内容绘制到原画布
        if (childBlendMode) maskEnd(this, currentMask, canvas, contentCanvas, maskCanvas, maskOpacity, undefined, false)

        excludeRenderBounds(child, options) || child.__render(contentCanvas || canvas, options)

        // 元素存在混合模式，应用遮罩后直接与原画布混合
        if (childBlendMode) maskEnd(this, currentMask, canvas, contentCanvas, maskCanvas, maskOpacity, childBlendMode as IBlendMode, false)

    }

    maskEnd(this, currentMask, canvas, contentCanvas, maskCanvas, maskOpacity, undefined, true)

}


function maskEnd(leaf: ILeaf, maskMode: IMaskMode, canvas: ILeaferCanvas, contentCanvas: ILeaferCanvas, maskCanvas: ILeaferCanvas, maskOpacity: number, blendMode: IBlendMode, recycle: boolean): void {
    switch (maskMode) {
        case 'grayscale':
            if (!usedGrayscaleAlpha) usedGrayscaleAlpha = true, maskCanvas.useGrayscaleAlpha(leaf.__nowWorld)
        case 'alpha':
            usePixelMask(leaf, canvas, contentCanvas, maskCanvas, blendMode, recycle); break
        case 'opacity-path':
            copyContent(leaf, canvas, contentCanvas, maskOpacity, blendMode, recycle); break
        case 'path':
            if (recycle) canvas.restore()
    }
}


function getCanvas(canvas: ILeaferCanvas): ILeaferCanvas {
    return canvas.getSameCanvas(false, true)
}


function usePixelMask(leaf: ILeaf, canvas: ILeaferCanvas, content: ILeaferCanvas, mask: ILeaferCanvas, blendMode: IBlendMode, recycle: boolean): void {
    const realBounds = leaf.__nowWorld
    content.resetTransform()
    content.opacity = 1
    content.useMask(mask, realBounds)
    if (recycle) mask.recycle(realBounds)

    copyContent(leaf, canvas, content, 1, blendMode, recycle)
}


function copyContent(leaf: ILeaf, canvas: ILeaferCanvas, content: ILeaferCanvas, maskOpacity: number, blendMode: IBlendMode, recycle: boolean): void {
    const realBounds = leaf.__nowWorld

    canvas.resetTransform()
    canvas.opacity = maskOpacity
    canvas.copyWorld(content, realBounds, undefined, blendMode)

    recycle ? content.recycle(realBounds) : content.clearWorld(realBounds)
}