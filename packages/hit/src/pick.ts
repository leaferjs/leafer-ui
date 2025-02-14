
import { IPointData, IPickOptions, IPickResult, ISelector, IUI } from '@leafer-ui/interface'
import { Group, Creator, Platform, emptyData } from '@leafer-ui/draw'

function getSelector(ui: IUI): ISelector {
    return ui.leafer ? ui.leafer.selector : (Platform.selector || (Platform.selector = Creator.selector()))
}

Group.prototype.pick = function (hitPoint: IPointData, options?: IPickOptions): IPickResult {
    Platform.backgrounder || this.updateLayout()
    options || (options = emptyData)
    return getSelector(this).getByPoint(hitPoint, options.hitRadius || 0, { ...options, target: this })
}