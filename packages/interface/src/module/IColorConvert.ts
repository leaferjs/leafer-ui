import { IColor } from '../type/IType'

export interface IColorConvertModule {
    string?(color: IColor, opacity?: number): string
}