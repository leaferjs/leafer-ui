import { IBoundsData, ILeaferImage } from '@leafer/interface'
import { MatrixHelper } from '@leafer/core'

import { IImagePaint, ILeafPaint, ILeafPaintPatternData } from '@leafer-ui/interface'

import { clipMode, fillOrFitMode, repeatMode } from './mode'


const { get, translate } = MatrixHelper

export function createData(leafPaint: ILeafPaint, image: ILeaferImage, paint: IImagePaint, box: IBoundsData): void {
    let { width, height } = image

    const { opacity, mode, offset, scale, rotation, blendMode } = paint
    const sameBox = box.width === width && box.height === height
    if (blendMode) leafPaint.blendMode = blendMode

    const data: ILeafPaintPatternData = leafPaint.data = { mode }

    switch (mode) {
        case 'strench':
            if (!sameBox) width = box.width, height = box.height
            if (box.x || box.y) {
                data.transform = get()
                translate(data.transform, box.x, box.y)
            }
            break
        case 'clip':
            if (offset || scale || rotation) clipMode(data, box, offset, scale, rotation)
            break
        case 'repeat':
            if (!sameBox || scale || rotation) repeatMode(data, box, width, height, scale as number, rotation)
            break
        case 'fit':
        case 'cover':
        default:
            if (!sameBox || rotation) fillOrFitMode(data, mode, box, width, height, rotation)
    }

    data.width = width
    data.height = height
    if (opacity) data.opacity = opacity
}
