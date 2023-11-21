import { ILeaferConfig } from '@leafer/interface'

import { ILeafer } from './ILeafer'
import { IEditorConfig } from '../editor/IEditor'

export interface IApp extends ILeafer {
    children: ILeafer[]
    realCanvas: boolean
}

export interface IAppConfig extends ILeaferConfig {
    ground?: ILeaferConfig
    tree?: ILeaferConfig
    sky?: ILeaferConfig
    editor?: IEditorConfig
}