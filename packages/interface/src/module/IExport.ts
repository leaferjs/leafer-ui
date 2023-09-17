import { ILeaf, IExportFileType, IBlob } from '@leafer/interface'

export interface IExportOptions {
    quality?: number
    blob?: boolean
}

export interface IExportResult {
    data: IBlob | string | boolean
}

export interface IExportResultFunction {
    (data: IExportResult): void
}


export interface IExportModule {
    export?(leaf: ILeaf, filename: IExportFileType | string, options?: IExportOptions | number | boolean): Promise<IExportResult>
}