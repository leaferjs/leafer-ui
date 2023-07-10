import { ILeaf, IExportFileType } from '@leafer/interface'

interface IExportConfig {
    type: IExportFileType
}

export interface IExportModule {
    export(leaf: ILeaf, config: IExportConfig): void
}