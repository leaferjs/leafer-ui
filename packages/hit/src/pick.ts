import { Platform } from '@leafer/core'

import { IPointData, IPickOptions, IPickResult } from '@leafer-ui/interface'
import { Group, emptyData } from '@leafer-ui/draw'


Group.prototype.pick = function (hitPoint: IPointData, options?: IPickOptions): IPickResult {
    options || (options = emptyData)
    this.updateLayout()
    return Platform.getSelector(this).getByPoint(hitPoint, options.hitRadius || 0, { ...options, target: this })
}