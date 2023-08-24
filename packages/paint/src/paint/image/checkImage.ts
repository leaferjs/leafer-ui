
import { ILeaferCanvas } from '@leafer/interface'
import { ImageManager } from '@leafer/core'

import { IUI, ILeafPaint } from '@leafer-ui/interface'

import { createPattern } from './createPattern'


export function checkImage(ui: IUI, canvas: ILeaferCanvas, paint: ILeafPaint, allowPaint?: boolean): boolean {
    const { width, height } = ui.__world

    if (!paint.image.ready || paint.patternId === width + height) {
        return false
    } else {

        const { data } = paint
        const max = 4096

        if (allowPaint && (width * canvas.pixelRatio > max || height * canvas.pixelRatio > max) && data.mode !== 'repeat') {
            canvas.save()
            canvas.clip()
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