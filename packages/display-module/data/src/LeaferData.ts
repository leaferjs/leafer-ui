import { canvasSizeAttrs } from '@leafer/core'

import { ILeaferData, IObject } from '@leafer-ui/interface'

import { GroupData } from './GroupData'

export class LeaferData extends GroupData implements ILeaferData {

    public __getInputData(): IObject {
        const data = super.__getInputData()
        canvasSizeAttrs.forEach(key => delete (data as IObject)[key])
        return data
    }
}
