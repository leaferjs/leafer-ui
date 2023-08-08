import { IBoundsData, ISizeData } from '@leafer/interface'
import { Platform, MatrixHelper, ImageEvent } from '@leafer/core'

import { IUI, IImagePaint, ILeafPaint, IMatrixData, IImagePaintMode, IPointData } from '@leafer-ui/interface'


const { get, rotateOfOuter, translate, scaleOfOuter, scale: scaleHelper, rotate } = MatrixHelper

export function image(ui: IUI, attrName: string, paint: IImagePaint, box: IBoundsData): ILeafPaint {
    const { type, blendMode } = paint
    let leaferPaint: ILeafPaint = { type, style: 'rgba(255,255,255,0)' }
    if (blendMode) leaferPaint.blendMode = blendMode

    const { imageManager } = ui.leafer
    const image = imageManager.get(paint)

    if (image.ready) {

        if (hasSize(ui, attrName, image)) {

            let transform: IMatrixData
            let { opacity, mode, offset, scale, rotation } = paint
            let { width, height } = image
            const sameBox = box.width === width && box.height === height

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

            createPattern(leaferPaint, image.getCanvas(width, height, opacity), transform, mode === 'repeat')

        }

    } else {

        imageManager.load(image,
            () => {
                if (ui.leafer) {
                    if (hasSize(ui, attrName, image)) ui.forceUpdate('width')
                    if (ui.hasEvent(ImageEvent.LOADED)) ui.emitEvent(new ImageEvent(ImageEvent.LOADED, ui, image, attrName, paint))
                }
            },
            (error) => {
                if (ui.hasEvent(ImageEvent.ERROR)) ui.emitEvent(new ImageEvent(ImageEvent.ERROR, ui, image, attrName, paint, error))
            }
        )

    }

    return leaferPaint
}

function hasSize(ui: IUI, attrName: string, image: ISizeData): boolean {
    const { __: data } = ui

    if (attrName === 'fill' && data) {
        if (!data.__naturalWidth || !data.__naturalHeight) {
            data.__naturalWidth = image.width
            data.__naturalHeight = image.height
            if (!data.__getInput('width') || !data.__getInput('height')) {
                ui.forceUpdate('width')
                return false
            }
        }
    }

    return true
}

function getFillOrFitTransform(mode: IImagePaintMode, box: IBoundsData, width: number, height: number, rotation: number): IMatrixData {
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
    return transform
}

function getClipTransform(box: IBoundsData, offset: IPointData, scale: number | IPointData, rotation: number): IMatrixData {
    const transform: IMatrixData = get()
    translate(transform, box.x, box.y)
    if (offset) translate(transform, offset.x, offset.y)
    if (scale) typeof scale === 'number' ? scaleHelper(transform, scale) : scaleHelper(transform, scale.x, scale.y)
    if (rotation) rotate(transform, rotation)
    return transform
}

function getRepeatTransform(box: IBoundsData, width: number, height: number, scale: number, rotation: number): IMatrixData {
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
    translate(transform, box.x, box.y)
    if (scale) scaleOfOuter(transform, box, scale)
    return transform
}


function createPattern(paint: ILeafPaint, canvas: any, transform?: IMatrixData, repeat?: boolean): void {
    let style = Platform.canvas.createPattern(canvas, repeat ? 'repeat' : 'no-repeat')
    if (transform) style.setTransform ? style.setTransform(transform) : paint.transform = transform
    paint.style = style
}