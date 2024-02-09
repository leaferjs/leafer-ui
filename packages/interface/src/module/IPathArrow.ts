import { IPathDataArrowMap } from '../type/IType'
import { IUI } from '../IUI'


export interface IPathArrowModule {
    list: IPathDataArrowMap
    addArrows(ui: IUI, changeRenderPath?: boolean): void
}