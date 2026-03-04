import { IPathDataArrow, IPathDataArrowMap } from '../type/IType'
import { IUI } from '../IUI'


export interface IPathArrowModule {
    list: IPathDataArrowMap
    fillList: IPathDataArrowMap
    addArrows(ui: IUI, updateCache?: boolean): void
    updateArrow(ui: IUI): void
    register(name: string, data: IPathDataArrow, fillData?: IPathDataArrow): void
    get(name: string): IPathDataArrow
}