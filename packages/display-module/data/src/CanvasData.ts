import { ICanvas, ICanvasData, ICanvasInputData, IObject, IJSONOptions } from '@leafer-ui/interface'

import { RectData } from './RectData'


export class CanvasData extends RectData implements ICanvasData {

    public get __isCanvas(): boolean { return true }
    public get __drawAfterFill(): boolean { return true }

    public __getInputData(names?: string[] | IObject, options?: IJSONOptions): IObject {
        const data: ICanvasInputData = super.__getInputData(names, options)
        data.url = (this.__leaf as ICanvas).canvas.toDataURL('image/png') as string
        return data
    }
}