import { ITextData, ITextDrawData } from '../IUI'

export interface ITextConvertModule {
    getDrawData(content: string | number, style: ITextData): ITextDrawData
}