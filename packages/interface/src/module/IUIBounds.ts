import { ILeafBounds } from '@leafer/interface'

import { IUI } from '../IUI'

export type IUIBoundsModule = IUIBounds & ThisType<IUI>

interface IUIBounds extends ILeafBounds {
}