import { ILeaferImage, IString } from '@leafer/interface'
import { ImageEvent, boundsType, dataProcessor, registerUI } from '@leafer/core'

import { IImage, IImageInputData, IImageData } from '@leafer-ui/interface'
import { ImageData } from '@leafer-ui/data'

import { Rect } from './Rect'


@registerUI()
export class Image extends Rect implements IImage {

    public get __tag() { return 'Image' }

    @dataProcessor(ImageData)
    declare public __: IImageData

    @boundsType('')
    public url: IString

    public get ready(): boolean { return this.image ? this.image.ready : false }

    public image?: ILeaferImage

    constructor(data?: IImageInputData) {
        super(data)
        this.on(ImageEvent.LOADED, (e: ImageEvent) => {
            if (e.attrName === 'fill' && e.attrValue.url === this.url) this.image = e.image
        })
    }

    public destroy(): void {
        this.image = null
        super.destroy()
    }

}

export const MyImage = Image