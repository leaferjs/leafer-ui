import { canvasSizeAttrs } from '@leafer/core'

import { ILeaferData, IObject, IJSONOptions } from '@leafer-ui/interface'

import { GroupData } from './GroupData'

export class LeaferData extends GroupData implements ILeaferData {

    public __getInputData(names?: string[] | IObject, options?: IJSONOptions): IObject {
        const data = super.__getInputData(names, options)
        canvasSizeAttrs.forEach(key => delete (data as IObject)[key])
        return data
    }
}
