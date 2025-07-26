import { ILeaf, ILeaferCanvas, IMaskType, IRenderOptions } from '@leafer/interface'
import { LeafBoundsHelper } from '@leafer/core'

import { Group } from '@leafer-ui/draw'


type IMaskMode = 'path' | 'alpha' | 'grayscale' | 'opacity-path'
const { excludeRenderBounds } = LeafBoundsHelper

Group.prototype.__renderMask = function (canvas: ILeaferCanvas, options: IRenderOptions): void {

    let child: ILeaf, maskCanvas: ILeaferCanvas, contentCanvas: ILeaferCanvas, maskOpacity: number, currentMask: IMaskMode, mask: boolean | IMaskType
    const { children } = this

    for (let i = 0, len = children.length; i < len; i++) {
        child = children[i], mask = child.__.mask

        if (mask) {

            if (currentMask) {
                maskEnd(this, currentMask, canvas, contentCanvas, maskCanvas, maskOpacity)
                maskCanvas = contentCanvas = null
            }

            // mask start

            if (mask === 'path' || mask === 'clipping-path') {

                if (child.opacity < 1) {

                    currentMask = 'opacity-path'
                    maskOpacity = child.opacity
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

            if (mask === 'clipping' || mask === 'clipping-path') excludeRenderBounds(child, options) || child.__render(contentCanvas || canvas, options) // 渲染自身到原画布中，不应用遮罩

            continue
        }

        excludeRenderBounds(child, options) || child.__render(contentCanvas || canvas, options)

    }

    maskEnd(this, currentMask, canvas, contentCanvas, maskCanvas, maskOpacity)

}


function maskEnd(leaf: ILeaf, maskMode: IMaskMode, canvas: ILeaferCanvas, contentCanvas: ILeaferCanvas, maskCanvas: ILeaferCanvas, maskOpacity: number): void {
    switch (maskMode) {
        case 'grayscale':
            maskCanvas.useGrayscaleAlpha(leaf.__nowWorld)
        case 'alpha':
            usePixelMask(leaf, canvas, contentCanvas, maskCanvas); break
        case 'opacity-path':
            copyContent(leaf, canvas, contentCanvas, maskOpacity); break
        case 'path':
            canvas.restore()
    }
}


function getCanvas(canvas: ILeaferCanvas): ILeaferCanvas {
    return canvas.getSameCanvas(false, true)
}


function usePixelMask(leaf: ILeaf, canvas: ILeaferCanvas, content: ILeaferCanvas, mask: ILeaferCanvas): void {
    const realBounds = leaf.__nowWorld
    content.resetTransform()
    content.opacity = 1
    content.useMask(mask, realBounds)
    mask.recycle(realBounds)

    copyContent(leaf, canvas, content, 1)
}


function copyContent(leaf: ILeaf, canvas: ILeaferCanvas, content: ILeaferCanvas, maskOpacity: number): void {
    const realBounds = leaf.__nowWorld

    canvas.resetTransform()
    canvas.opacity = maskOpacity
    canvas.copyWorld(content, realBounds)

    content.recycle(realBounds)
}