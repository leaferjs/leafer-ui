import { ICanvas, ICanvasData, ICanvasInputData, IObject } from '@leafer-ui/interface'

import { RectData } from './RectData'


export class CanvasData extends RectData implements ICanvasData {

    public __getInputData(): IObject {
        const data: ICanvasInputData = super.__getInputData()
        data.url = (this.__leaf as ICanvas).canvas.toDataURL('image/png') as string
        return data
    }
}