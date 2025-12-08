import { IBooleanMap, ILeaferImage, IObject } from '@leafer/interface'
import { ImageManager, isArray } from '@leafer/core'

import { IImagePaint, ILeafPaint, IPaintAttr, IUIData } from '@leafer-ui/interface'


export function recycleImage(attrName: IPaintAttr, data: IUIData): IBooleanMap {
    const paints: ILeafPaint[] = (data as IObject)['_' + attrName]

    if (isArray(paints)) {

        let paint: ILeafPaint, image: ILeaferImage, recycleMap: IBooleanMap, input: IImagePaint[], url: string

        for (let i = 0, len = paints.length; i < len; i++) {

            paint = paints[i]
            image = paint.image
            url = image && image.url

            if (url) {
                if (!recycleMap) recycleMap = {}
                recycleMap[url] = true
                ImageManager.recyclePaint(paint)

                // stop load
                if (image.loading) {
                    if (!input) {
                        input = (data.__input && data.__input[attrName]) || []
                        if (!isArray(input)) input = [input]
                    }
                    image.unload(paints[i].loadId, !input.some((item: IImagePaint) => item.url === url))
                }
            }

        }

        return recycleMap

    }

    return null
}