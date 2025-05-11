import { ILeaferConfig } from '@leafer/interface'

import { ILeafer } from './ILeafer'
import { IEditorConfig } from '../editor/IEditor'

export interface IApp extends ILeafer {
    children: ILeafer[]
    realCanvas: boolean
    forEach(fn: IAppForEachFunction): void
}

export interface IAppConfig extends ILeaferConfig {
    ground?: ILeaferConfig
    tree?: ILeaferConfig
    sky?: ILeaferConfig
    editor?: IEditorConfig
}

export interface IAppForEachFunction {
    (value: ILeafer, index: number, array: ILeafer[]): void
}