import { __String } from '@leafer/interface'
import { boundsType, dataProcessor, registerUI } from '@leafer/core'

import { IImage, IImageInputData, IImageData } from '@leafer-ui/interface'
import { ImageData } from '@leafer-ui/data'

import { Rect } from './Rect'


@registerUI()
export class Image extends Rect implements IImage {

    @dataProcessor(ImageData)
    public __: IImageData

    @boundsType('')
    public url: __String

    @boundsType('')
    public thumb: __String

    constructor(data?: IImageInputData) {
        super(data)
    }

}