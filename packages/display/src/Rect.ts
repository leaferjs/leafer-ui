import { IPathDrawer, IPathCommandData, __Number } from '@leafer/interface'
import { dataProcessor, registerUI, useModule } from '@leafer/core'

import { IRect, IRectInputData, IRectData } from '@leafer-ui/interface'
import { RectData } from '@leafer-ui/data'
import { RectRender } from '@leafer-ui/display-module'

import { UI } from './UI'


@useModule(RectRender)
@registerUI()
export class Rect extends UI implements IRect {

    public get __tag() { return 'Rect' }

    @dataProcessor(RectData)
    declare public __: IRectData

    constructor(data?: IRectInputData) {
        super(data)
    }

    public __drawPathByData(drawer: IPathDrawer, _data: IPathCommandData): void {
        const { width, height, cornerRadius } = this.__
        if (cornerRadius) {
            drawer.roundRect(0, 0, width, height, cornerRadius)
        } else {
            drawer.rect(0, 0, width, height)
        }
    }
}