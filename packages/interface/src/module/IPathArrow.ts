import { IPathCommandData } from '@leafer/interface'
import { IArrowType } from '../type/IType'


export interface IPathArrowModule {
    add(path: IPathCommandData, startArrow?: IArrowType, endArrow?: IArrowType): IPathCommandData
}