
import { IFindMethod, IPointData, IPickOptions, IPickResult } from '@leafer/interface'
import { IFindUIMethod, IUI } from '@leafer-ui/interface'
import { UI, Group } from '@leafer-ui/draw'


const ui = UI.prototype, group = Group.prototype

ui.find = function (condition: number | string | IFindUIMethod, options?: any): IUI[] {
    return this.leafer ? this.leafer.selector.getBy(condition as IFindMethod, this, false, options) as IUI[] : []
}

ui.findOne = function (condition: number | string | IFindUIMethod, options?: any): IUI | undefined {
    return this.leafer ? this.leafer.selector.getBy(condition as IFindMethod, this, true, options) as IUI : null
}

group.pick = function (hitPoint: IPointData, options?: IPickOptions): IPickResult {
    this.__layout.update()
    if (!options) options = {}
    return this.leafer ? this.leafer.selector.getByPoint(hitPoint, options.hitRadius || 0, { ...options, target: this }) : null
}