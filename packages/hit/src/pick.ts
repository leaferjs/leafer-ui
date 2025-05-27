import { Platform, Creator } from '@leafer/core'

import { IPointData, IPickOptions, IPickResult, ISelector, IUI } from '@leafer-ui/interface'
import { Group, emptyData } from '@leafer-ui/draw'

function getSelector(ui: IUI): ISelector {
    return ui.leafer ? ui.leafer.selector : (Platform.selector || (Platform.selector = Creator.selector()))
}

Group.prototype.pick = function (hitPoint: IPointData, options?: IPickOptions): IPickResult {
    options || (options = emptyData)
    this.updateLayout()
    return getSelector(this).getByPoint(hitPoint, options.hitRadius || 0, { ...options, target: this })
}