import { IImageData, IImageInputData, IImage, IObject, IJSONOptions } from '@leafer-ui/interface'

import { RectData } from './RectData'


export class ImageData extends RectData implements IImageData {

    declare public __leaf: IImage

    protected _url: string

    protected setUrl(value: string) {
        this.__setImageFill(value)
        this._url = value
    }

    public __setImageFill(value: string): void {
        (this as IImageInputData).fill = value ? { type: 'image', mode: 'stretch', url: value } : undefined
    }

    public __getData(): IObject {
        const data: IImageInputData = super.__getData()
        if (data.url) delete data.fill
        return data
    }

    public __getInputData(names?: string[] | IObject, options?: IJSONOptions): IObject {
        const data: IImageInputData = super.__getInputData(names, options)
        if (data.url) delete data.fill
        return data
    }
}