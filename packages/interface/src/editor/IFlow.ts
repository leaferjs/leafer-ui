import { IAxis, IObject } from '@leafer/interface'


export interface IEditFlowConfig extends IObject {
    insertFit?: boolean | IAxis
    insertable?: boolean
    isSplitFlow?: boolean
}