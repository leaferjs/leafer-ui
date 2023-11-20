import { IControl, ILeaferAttrData } from '@leafer/interface'
import { IApp } from './IApp'
import { IGroup } from '../IUI'

export interface ILeafer extends IGroup, ILeaferAttrData, IControl {
    readonly isApp: boolean
    readonly app: ILeafer
    parent?: IApp
    zoomLayer?: IGroup
    editor?: IGroup

    ground?: ILeafer
    tree?: ILeafer
    sky?: ILeafer
}
