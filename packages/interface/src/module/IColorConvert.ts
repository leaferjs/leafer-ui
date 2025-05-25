import { IColor, IRGBA } from '../type/IType'

export interface IColorConvertModule {
    string(color: IColor, opacity?: number): string
    object(color: IColor, opacity?: number): IRGBA
    hasTransparent(color: string): boolean
}