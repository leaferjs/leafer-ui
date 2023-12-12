import { IBoundsData, IPointData, IMatrixData, } from '@leafer/interface'
import { MatrixHelper } from '@leafer/core'

import { IImagePaintMode, ILeafPaintPatternData } from '@leafer-ui/interface'


let origin = {} as IPointData
const { get, rotateOfOuter, translate, scaleOfOuter, scale: scaleHelper, rotate } = MatrixHelper

export function fillOrFitMode(data: ILeafPaintPatternData, mode: IImagePaintMode, box: IBoundsData, width: number, height: number, rotation: number): void {
    const transform: IMatrixData = get()
    const swap = rotation && rotation !== 180
    const sw = box.width / (swap ? height : width)
    const sh = box.height / (swap ? width : height)
    const scale = mode === 'fit' ? Math.min(sw, sh) : Math.max(sw, sh)
    const x = box.x + (box.width - width * scale) / 2
    const y = box.y + (box.height - height * scale) / 2
    translate(transform, x, y)
    scaleHelper(transform, scale)
    if (rotation) rotateOfOuter(transform, { x: box.x + box.width / 2, y: box.y + box.height / 2 }, rotation)
    data.scaleX = data.scaleY = scale
    data.transform = transform
}


export function clipMode(data: ILeafPaintPatternData, box: IBoundsData, x: number, y: number, scaleX: number, scaleY: number, rotation: number): void {
    const transform: IMatrixData = get()
    translate(transform, box.x, box.y)
    if (x || y) translate(transform, x, y)
    if (scaleX) {
        scaleHelper(transform, scaleX, scaleY)
        data.scaleX = transform.a
        data.scaleY = transform.d
    }
    if (rotation) rotate(transform, rotation)
    data.transform = transform
}


export function repeatMode(data: ILeafPaintPatternData, box: IBoundsData, width: number, height: number, x: number, y: number, scaleX: number, scaleY: number, rotation: number): void {
    const transform = get()
    if (rotation) {
        rotate(transform, rotation)
        switch (rotation) {
            case 90:
                translate(transform, height, 0)
                break
            case 180:
                translate(transform, width, height)
                break
            case 270:
                translate(transform, 0, width)
                break
        }
    }
    origin.x = box.x
    origin.y = box.y
    if (x || y) origin.x += x, origin.y += y
    translate(transform, origin.x, origin.y)
    if (scaleX) {
        scaleOfOuter(transform, origin, scaleX, scaleY)
        data.scaleX = scaleX
        data.scaleY = scaleY
    }
    data.transform = transform
}