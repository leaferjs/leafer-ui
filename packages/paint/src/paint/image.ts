import { IBoundsData, IImageEvent, ILeaferImage, ISizeData } from '@leafer/interface'
import { Platform, MatrixHelper, ImageEvent, ImageManager } from '@leafer/core'

import { IUI, IImagePaint, ILeafPaint, IMatrixData, IImagePaintMode, IPointData } from '@leafer-ui/interface'


const { get, rotateOfOuter, translate, scaleOfOuter, scale: scaleHelper, rotate } = MatrixHelper

export function image(ui: IUI, attrName: string, attrValue: IImagePaint, box: IBoundsData, first: boolean): ILeafPaint {
    const leafPaint: ILeafPaint = { type: attrValue.type }
    const image = leafPaint.image = ImageManager.get(attrValue)

    if (image.ready && hasNaturalSize(ui, attrName, image)) createStyle(leafPaint, image, attrValue, box)

    if (first) {

        const event: IImageEvent = { target: ui, image, attrName, attrValue }

        if (image.ready) {

            emit(ImageEvent.LOAD, event)
            emit(ImageEvent.LOADED, event)

        } else if (image.error) {

            ui.forceUpdate('surface')
            event.error = image.error
            emit(ImageEvent.ERROR, event)

        } else {

            emit(ImageEvent.LOAD, event)

            leafPaint.loadId = image.load(
                () => {
                    if (ui.__) {

                        if (hasNaturalSize(ui, attrName, image)) {
                            createStyle(leafPaint, image, attrValue, box)
                            ui.forceUpdate('surface')
                        }

                        emit(ImageEvent.LOADED, event)
                    }
                },
                (error) => {
                    ui.forceUpdate('surface')
                    event.error = error
                    emit(ImageEvent.ERROR, event)
                }
            )

        }

    }

    return leafPaint
}


function emit(type: string, data: IImageEvent): void {
    if (data.target.hasEvent(type)) data.target.emitEvent(new ImageEvent(type, data))
}

function hasNaturalSize(ui: IUI, attrName: string, image: ISizeData): boolean {
    if (attrName === 'fill' && !ui.__.__naturalWidth) {
        const { __: d } = ui
        d.__naturalWidth = image.width
        d.__naturalHeight = image.height
        if (!d.__getInput('width') || !d.__getInput('height')) {
            ui.forceUpdate('width')
            return false
        }
    }
    return true
}


function createStyle(leafPaint: ILeafPaint, image: ILeaferImage, paint: IImagePaint, box: IBoundsData): void {
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

    createPattern(leafPaint, image.getCanvas(width, height, opacity), transform, mode === 'repeat')
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
    try {
        if (transform) style.setTransform ? style.setTransform(transform) : paint.transform = transform
    } catch (e) {
        paint.transform = transform
    }

    paint.style = style
}