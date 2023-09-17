
import { ILeaferCanvas } from '@leafer/interface'
import { ImageManager } from '@leafer/core'

import { IUI, ILeafPaint } from '@leafer-ui/interface'

import { createPattern } from './pattern'


export function checkImage(ui: IUI, canvas: ILeaferCanvas, paint: ILeafPaint, allowPaint?: boolean): boolean {
    const { scaleX, scaleY } = ui.__world

    if (!paint.data || paint.patternId === scaleX + '-' + scaleY) {
        return false
    } else {

        if (allowPaint) {
            if (paint.image.isSVG && paint.data.mode !== 'repeat') {
                let { width, height } = paint.data
                width *= scaleX * canvas.pixelRatio
                height *= scaleY * canvas.pixelRatio
                allowPaint = width > 4096 || height > 4096
            } else {
                allowPaint = false
            }
        }

        if (allowPaint) {
            canvas.save()
            canvas.clip()
            const { data } = paint
            if (paint.blendMode) canvas.blendMode = paint.blendMode
            if (data.opacity) canvas.opacity *= data.opacity
            if (data.transform) canvas.transform(data.transform)
            canvas.drawImage(paint.image.view as any, 0, 0, data.width, data.height)
            canvas.restore()
            return true
        } else {
            if (!paint.style) {
                createPattern(ui, paint, canvas.pixelRatio)
            } else {
                ImageManager.patternTasker.add(async () => {
                    if (canvas.bounds.hit(ui.__world) && createPattern(ui, paint, canvas.pixelRatio)) ui.forceUpdate('surface')
                }, 300)
            }
            return false
        }
    }
}