import { ILeaferImage, __String } from '@leafer/interface'
import { ImageEvent, boundsType, dataProcessor, registerUI } from '@leafer/core'

import { IImage, IImageInputData, IImageData, IImagePaint } from '@leafer-ui/interface'
import { ImageData } from '@leafer-ui/data'

import { Rect } from './Rect'


@registerUI()
export class Image extends Rect implements IImage {

    public get __tag() { return 'Image' }

    @dataProcessor(ImageData)
    public __: IImageData

    @boundsType('')
    public url: __String

    public get ready(): boolean { return this.image ? this.image.ready : false }

    public image: ILeaferImage

    constructor(data?: IImageInputData) {
        super(data)
    }

    public __updateBoxBounds(): void {

        let update: boolean

        const { url } = this
        const fill = this.fill as IImagePaint

        if (fill) {
            if (fill.url !== url) update = true
        } else {
            if (url) update = true
        }

        if (update) {
            if (this.image) this.image = null
            this.fill = { type: 'image', mode: 'strench', url }
            this.once(ImageEvent.LOADED, (e) => this.image = e.image)
        }

        super.__updateBoxBounds()

    }

    public destroy(): void {
        this.image = null
        super.destroy()
    }

}