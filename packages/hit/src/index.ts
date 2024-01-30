export * from './LeafHit'
export * from './UIHit'
export * from './RectHit'

import { IFindMethod, IPointData, IPickOptions, IPickResult } from '@leafer/interface'
import { IFindUIMethod, IUI } from '@leafer-ui/interface'
import { UI, Group } from '@leafer-ui/draw'


UI.prototype.find = function (condition: number | string | IFindUIMethod, options?: any): IUI[] {
    return this.leafer ? this.leafer.selector.getBy(condition as IFindMethod, this, false, options) as IUI[] : []
}

UI.prototype.findOne = function (condition: number | string | IFindUIMethod, options?: any): IUI {
    return this.leafer ? this.leafer.selector.getBy(condition as IFindMethod, this, true, options) as IUI : null
}

Group.prototype.pick = function (hitPoint: IPointData, options?: IPickOptions): IPickResult {
    this.__layout.update()
    if (!options) options = {}
    return this.leafer ? this.leafer.selector.getByPoint(hitPoint, options.hitRadius || 0, { ...options, target: this }) : null
}
