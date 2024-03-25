import { IControl, ILeaferAttrData, ILeaferConfig, ILeaferType } from '@leafer/interface'
import { IApp } from './IApp'
import { IGroup } from '../IUI'
import { IEditorBase } from '../editor/IEditor'

export interface ILeafer extends IGroup, ILeaferAttrData, IControl {
    readonly isApp: boolean
    readonly app: ILeafer
    parent?: IApp
    zoomLayer: IGroup
    editor: IEditorBase

    ground?: ILeafer
    tree?: ILeafer
    sky?: ILeafer

    userConfig?: ILeaferConfig

    onInit(): void
    initType(type: ILeaferType): void
    destroy(sync?: boolean): void
}
