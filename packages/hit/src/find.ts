
import { IFindMethod, IPointData, IPickOptions, IPickResult, ISelector } from '@leafer/interface'
import { IFindUIMethod, IUI } from '@leafer-ui/interface'
import { UI, Group, Creator, Platform } from '@leafer-ui/draw'


const ui = UI.prototype, group = Group.prototype

function getSelector(ui: IUI): ISelector {
    return ui.leafer ? ui.leafer.selector : (Platform.selector || (Platform.selector = Creator.selector()))
}

ui.find = function (condition: number | string | IFindUIMethod, options?: any): IUI[] {
    return getSelector(this).getBy(condition as IFindMethod, this, false, options) as IUI[]
}

ui.findOne = function (condition: number | string | IFindUIMethod, options?: any): IUI | undefined {
    return getSelector(this).getBy(condition as IFindMethod, this, true, options) as IUI
}

group.pick = function (hitPoint: IPointData, options?: IPickOptions): IPickResult {
    this.__layout.update()
    if (!options) options = {}
    return getSelector(this).getByPoint(hitPoint, options.hitRadius || 0, { ...options, target: this })
}