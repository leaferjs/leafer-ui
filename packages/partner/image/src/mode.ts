import { IBoundsData, IPointData, IMatrixData, IAround, } from '@leafer/interface'
import { MatrixHelper } from '@leafer/core'

import { ILeafPaintPatternData } from '@leafer-ui/interface'


let origin = {} as IPointData
const { get, rotateOfOuter, translate, scaleOfOuter, scale: scaleHelper, rotate } = MatrixHelper

export function fillOrFitMode(data: ILeafPaintPatternData, box: IBoundsData, x: number, y: number, scaleX: number, scaleY: number, rotation: number): void {
    const transform: IMatrixData = get()
    translate(transform, box.x + x, box.y + y)
    scaleHelper(transform, scaleX, scaleY)
    if (rotation) rotateOfOuter(transform, { x: box.x + box.width / 2, y: box.y + box.height / 2 }, rotation)
    data.transform = transform
}


export function clipMode(data: ILeafPaintPatternData, box: IBoundsData, x: number, y: number, scaleX: number, scaleY: number, rotation: number): void {
    const transform: IMatrixData = get()
    translate(transform, box.x + x, box.y + y)
    if (scaleX) scaleHelper(transform, scaleX, scaleY)
    if (rotation) rotate(transform, rotation)
    data.transform = transform
}


export function repeatMode(data: ILeafPaintPatternData, box: IBoundsData, width: number, height: number, x: number, y: number, scaleX: number, scaleY: number, rotation: number, around: IAround): void {
    const transform = get()
    if (rotation) {
        if (around === 'center') {
            rotateOfOuter(transform, { x: width / 2, y: height / 2 }, rotation)
        } else {
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
    }
    origin.x = box.x + x
    origin.y = box.y + y
    translate(transform, origin.x, origin.y)
    if (scaleX) scaleOfOuter(transform, origin, scaleX, scaleY)
    data.transform = transform
}