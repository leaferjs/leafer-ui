import { IBooleanMap, ILeaferImage } from '@leafer/interface'
import { ImageManager } from '@leafer/core'

import { IImagePaint, ILeafPaint, IUIData } from '@leafer-ui/interface'


export function recycleImage(attrName: 'fill' | 'stroke', data: IUIData): IBooleanMap {
    const paints = (attrName === 'fill' ? data._fill : data._stroke) as ILeafPaint[]

    if (paints instanceof Array) {

        let image: ILeaferImage, recycleMap: IBooleanMap, input: IImagePaint[], url: string

        for (let i = 0, len = paints.length; i < len; i++) {

            image = paints[i].image
            url = image && image.url

            if (url) {
                if (!recycleMap) recycleMap = {}
                recycleMap[url] = true
                ImageManager.recycle(image)

                // stop load
                if (image.loading) {
                    if (!input) {
                        input = (data.__input && data.__input[attrName]) || []
                        if (!(input instanceof Array)) input = [input]
                    }
                    image.unload(paints[i].loadId, !input.some((item: IImagePaint) => item.url === url))
                }
            }

        }

        return recycleMap

    }

    return null
}