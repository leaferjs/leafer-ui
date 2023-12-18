import { IImageData, IImageInputData, IImage } from '@leafer-ui/interface'

import { RectData } from './RectData'


export class ImageData extends RectData implements IImageData {

    declare public __leaf: IImage

    protected _url: string

    protected setUrl(value: string) {
        if (this.__leaf.image) this.__leaf.image = null;
        (this as IImageInputData).fill = value ? { type: 'image', mode: 'strench', url: value } : undefined
        this._url = value
    }
}