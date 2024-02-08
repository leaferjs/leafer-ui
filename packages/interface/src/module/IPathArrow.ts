import { IPathCommandData } from '@leafer/interface'
import { IPathDataArrowMap } from '../type/IType'
import { IUI } from '../IUI'


export interface IPathArrowModule {
    list: IPathDataArrowMap
    add(ui: IUI, path: IPathCommandData): IPathCommandData
}