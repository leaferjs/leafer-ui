
import { ILeaferCanvas } from '@leafer/interface'
import { ImageManager } from '@leafer/core'

import { IUI, ILeafPaint } from '@leafer-ui/interface'

import { createPattern } from './pattern'


export function checkImage(ui: IUI, canvas: ILeaferCanvas, paint: ILeafPaint, allowPaint?: boolean): boolean {
    let { width, height } = ui.__world

    if (!paint.data || paint.patternId === width + height) {
        return false
    } else {

        if (allowPaint) {
            if (paint.image.isSVG && paint.data.mode !== 'repeat') {
                width *= canvas.pixelRatio
                height *= canvas.pixelRatio
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
            ImageManager.patternTasker.addParallel(() => {
                if (canvas.bounds.hit(ui.__world)) {
                    createPattern(ui, paint, canvas.pixelRatio)
                    ui.forceUpdate('surface')
                }
            }, null, true)
            return false
        }
    }
}