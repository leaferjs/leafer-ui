import { IPathDrawer, IPathCommandData } from '@leafer/interface'
import { BoundsHelper, dataProcessor, registerUI, rewrite, rewriteAble, useModule } from '@leafer/core'

import { IRect, IRectInputData, IRectData, IRadiusPointData } from '@leafer-ui/interface'
import { RectData } from '@leafer-ui/data'
import { RectRender } from '@leafer-ui/display-module'

import { UI } from './UI'


@useModule(RectRender)
@rewriteAble()
@registerUI()
export class Rect extends UI implements IRect {

    public get __tag() { return 'Rect' }

    @dataProcessor(RectData)
    declare public __: IRectData

    constructor(data?: IRectInputData) {
        super(data)
    }

    @rewrite(UI.prototype.__drawPathByBox)
    public __drawPathByData(_drawer: IPathDrawer, _data: IPathCommandData): void { }

}