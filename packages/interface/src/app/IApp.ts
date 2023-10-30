import { ILeafer } from './ILeafer'

export interface IApp extends ILeafer {
    children: ILeafer[]
    realCanvas: boolean
}
