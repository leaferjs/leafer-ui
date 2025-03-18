import { ILeaf, IExportFileType, IExportOptions, IExportResult } from '@leafer/interface'


export interface IExportModule {
    running?: boolean
    export(leaf: ILeaf, filename: IExportFileType | string, options?: IExportOptions | number | boolean): Promise<IExportResult>
    syncExport(leaf: ILeaf, filename: string, options?: IExportOptions | number | boolean): IExportResult
}