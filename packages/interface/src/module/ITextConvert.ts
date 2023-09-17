import { ITextData, ITextDrawData } from '../IUI'

export interface ITextConvertModule {
    getDrawData?(content: string, style: ITextData): ITextDrawData
}