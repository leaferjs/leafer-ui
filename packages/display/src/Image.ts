import { ILeaferImage, IString } from '@leafer/interface'
import { boundsType, dataProcessor, registerUI } from '@leafer/core'

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

    public get ready(): boolean { const { image } = this; return image && image.ready }

    public get image(): ILeaferImage { const { fill } = this.__; return fill instanceof Array && fill[0].image }

    constructor(data?: IImageInputData) {
        super(data)
    }

}

export const MyImage = Image