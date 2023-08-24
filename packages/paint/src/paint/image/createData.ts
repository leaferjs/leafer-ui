import { IBoundsData, ILeaferImage } from '@leafer/interface'
import { MatrixHelper } from '@leafer/core'

import { IImagePaint, ILeafPaint, IMatrixData } from '@leafer-ui/interface'

import { getClipTransform, getFillOrFitTransform, getRepeatTransform } from './getTransform'


const { get, translate } = MatrixHelper

export function createData(leafPaint: ILeafPaint, image: ILeaferImage, paint: IImagePaint, box: IBoundsData): void {
    let transform: IMatrixData
    let { width, height } = image

    const { opacity, mode, offset, scale, rotation, blendMode } = paint
    const sameBox = box.width === width && box.height === height
    if (blendMode) leafPaint.blendMode = blendMode

    switch (mode) {
        case 'strench':
            if (!sameBox) width = box.width, height = box.height
            if (box.x || box.y) {
                transform = get()
                translate(transform, box.x, box.y)
            }
            break
        case 'clip':
            if (offset || scale || rotation) transform = getClipTransform(box, offset, scale, rotation)
            break
        case 'repeat':
            if (!sameBox || scale || rotation) transform = getRepeatTransform(box, width, height, scale as number, rotation)
            break
        case 'fit':
        case 'cover':
        default:
            if (!sameBox || rotation) transform = getFillOrFitTransform(mode, box, width, height, rotation)
    }

    leafPaint.data = { width, height, opacity, transform, mode }
}
