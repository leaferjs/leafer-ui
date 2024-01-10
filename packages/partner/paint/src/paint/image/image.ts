import { IBoundsData, IImageEvent, ISizeData } from '@leafer/interface'
import { ImageEvent, ImageManager } from '@leafer/core'

import { IUI, IImagePaint, ILeafPaint } from '@leafer-ui/interface'

import { createData } from './data'


export function image(ui: IUI, attrName: string, attrValue: IImagePaint, box: IBoundsData, firstUse: boolean): ILeafPaint {

    const leafPaint: ILeafPaint = { type: attrValue.type }
    const image = leafPaint.image = ImageManager.get(attrValue)

    const event: IImageEvent = (firstUse || image.loading) && { image, attrName, attrValue }

    if (image.ready) {

        if (hasNaturalSize(ui, attrName, image)) createData(leafPaint, image, attrValue, box)

        if (firstUse) {
            emit(ui, ImageEvent.LOAD, event)
            emit(ui, ImageEvent.LOADED, event)
        }

    } else if (image.error) {

        if (firstUse) {
            ui.forceUpdate('surface')
            event.error = image.error
            emit(ui, ImageEvent.ERROR, event)
        }

    } else {

        if (firstUse) emit(ui, ImageEvent.LOAD, event)

        leafPaint.loadId = image.load(
            () => {
                leafPaint.loadId = null
                if (!ui.destroyed) {

                    if (hasNaturalSize(ui, attrName, image)) {
                        createData(leafPaint, image, attrValue, box)
                        ui.forceUpdate('surface')
                    }

                    emit(ui, ImageEvent.LOADED, event)
                }
            },
            (error) => {
                leafPaint.loadId = null
                ui.forceUpdate('surface')
                event.error = error
                emit(ui, ImageEvent.ERROR, event)
            }
        )

    }

    return leafPaint
}


function hasNaturalSize(ui: IUI, attrName: string, image: ISizeData): boolean {
    if (attrName === 'fill' && !ui.__.__naturalWidth) {
        const { __: d } = ui
        d.__naturalWidth = image.width
        d.__naturalHeight = image.height
        if (!d.__getInput('width') || !d.__getInput('height')) {
            ui.forceUpdate('width')
            if (ui.__proxyData) {
                ui.setProxyAttr('width', ui.__.width)
                ui.setProxyAttr('height', ui.__.height)
            }
            return false
        }
    }
    return true
}

function emit(ui: IUI, type: string, data: IImageEvent): void {
    if (ui.hasEvent(type)) ui.emitEvent(new ImageEvent(type, data))
}

