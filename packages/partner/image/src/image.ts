import { IBoundsData, IImageEvent, ILeaferImage, IObject } from '@leafer/interface'
import { Bounds, BoundsHelper, ImageEvent, ImageManager } from '@leafer/core'

import { IUI, IImagePaint, ILeafPaint } from '@leafer-ui/interface'

import { createData } from './data'


interface IImagePaintCache {
    leafPaint: ILeafPaint
    paint: IImagePaint
    boxBounds: IBoundsData
}

let cache: IImagePaintCache, box = new Bounds()
const { isSame } = BoundsHelper

export function image(ui: IUI, attrName: string, paint: IImagePaint, boxBounds: IBoundsData, firstUse: boolean): ILeafPaint {
    let leafPaint: ILeafPaint, event: IImageEvent
    const image = ImageManager.get(paint)

    if (cache && paint === cache.paint && isSame(boxBounds, cache.boxBounds)) {
        leafPaint = cache.leafPaint
    } else {
        leafPaint = { type: paint.type }
        leafPaint.image = image

        cache = image.use > 1 ? { leafPaint, paint, boxBounds: box.set(boxBounds) } : null
    }

    if (firstUse || image.loading) event = { image, attrName, attrValue: paint }

    if (image.ready) {

        checkSizeAndCreateData(ui, attrName, paint, image, leafPaint, boxBounds)

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
                if (!ui.destroyed) {
                    if (checkSizeAndCreateData(ui, attrName, paint, image, leafPaint, boxBounds)) ui.forceUpdate('surface')
                    onLoadSuccess(ui, event)
                }
                leafPaint.loadId = null
            },
            (error) => {
                onLoadError(ui, event, error)
                leafPaint.loadId = null
            }
        )

    }

    return leafPaint
}


function checkSizeAndCreateData(ui: IUI, attrName: string, paint: IImagePaint, image: ILeaferImage, leafPaint: ILeafPaint, boxBounds: IBoundsData): boolean {
    if (attrName === 'fill' && !ui.__.__naturalWidth) {
        const data = ui.__
        data.__naturalWidth = image.width
        data.__naturalHeight = image.height
        if (data.__autoSide) {
            ui.forceUpdate('width')
            if (ui.__proxyData) {
                ui.setProxyAttr('width', data.width)
                ui.setProxyAttr('height', data.height)
            }
            return false
        }
    }

    if (!leafPaint.data) createData(leafPaint, image, paint, boxBounds)
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