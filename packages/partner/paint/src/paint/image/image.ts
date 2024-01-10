import { IBoundsData, IImageEvent, ILeaferImage, IObject } from '@leafer/interface'
import { ImageEvent, ImageManager } from '@leafer/core'

import { IUI, IImagePaint, ILeafPaint } from '@leafer-ui/interface'

import { createData } from './data'


export function image(ui: IUI, attrName: string, attrValue: IImagePaint, box: IBoundsData, firstUse: boolean): ILeafPaint {

    const leafPaint: ILeafPaint = { type: attrValue.type }
    const image = leafPaint.image = ImageManager.get(attrValue)

    const event: IImageEvent = (firstUse || image.loading) && { image, attrName, attrValue }

    if (image.ready) {

        checkSizeAndCreateData(ui, attrName, attrValue, image, leafPaint, box)

        if (firstUse) {
            onLoad(ui, event)
            onLoadSuccess(ui, event)
        }

    } else if (image.error) {

        if (firstUse) onLoadError(ui, event, image.error)

    } else { // need load

        if (firstUse) onLoad(ui, event)

        leafPaint.loadId = image.load(
            () => {
                leafPaint.loadId = null
                if (!ui.destroyed) {
                    if (checkSizeAndCreateData(ui, attrName, attrValue, image, leafPaint, box)) ui.forceUpdate('surface')
                    onLoadSuccess(ui, event)
                }
            },
            (error) => {
                leafPaint.loadId = null
                onLoadError(ui, event, error)
            }
        )

    }

    return leafPaint
}


function checkSizeAndCreateData(ui: IUI, attrName: string, attrValue: IImagePaint, image: ILeaferImage, leafPaint: ILeafPaint, box: IBoundsData): boolean {
    if (attrName === 'fill' && !ui.__.__naturalWidth) {
        const { __: d } = ui
        d.__naturalWidth = image.width
        d.__naturalHeight = image.height
        if (d.__autoWidth || d.__autoHeight) {
            ui.forceUpdate('width')
            if (ui.__proxyData) {
                ui.setProxyAttr('width', ui.__.width)
                ui.setProxyAttr('height', ui.__.height)
            }
            return false
        }
    }

    createData(leafPaint, image, attrValue, box)
    return true
}



function onLoad(ui: IUI, event: IImageEvent): void {
    emit(ui, ImageEvent.LOAD, event)
}


function onLoadSuccess(ui: IUI, event: IImageEvent): void {
    emit(ui, ImageEvent.LOADED, event)
}


function onLoadError(ui: IUI, event: IImageEvent, error: string | IObject,): void {
    event.error = error
    ui.forceUpdate('surface')
    emit(ui, ImageEvent.ERROR, event)
}

function emit(ui: IUI, type: string, data: IImageEvent): void {
    if (ui.hasEvent(type)) ui.emitEvent(new ImageEvent(type, data))
}