import { IPathDataArrow, IPathDataArrowMap } from '../type/IType'
import { IUI } from '../IUI'


export interface IPathArrowModule {
    list: IPathDataArrowMap
    addArrows(ui: IUI): void
    register(name: string, data: IPathDataArrow): void
    get(name: string): IPathDataArrow
}