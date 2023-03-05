import { ICanvasDrawPath, IPathCommandData } from '@leafer/interface'
import { dataProcessor, registerUI, useModule } from '@leafer/core'

import { IRect, IRectInputData, IRectData } from '@leafer-ui/interface'
import { RectData } from '@leafer-ui/data'
import { RectRender } from '@leafer-ui/module'

import { UI } from './UI'


@useModule(RectRender)
@registerUI()
export class Rect extends UI implements IRect {

    @dataProcessor(RectData)
    public __: IRectData

    constructor(data?: IRectInputData) {
        super(data)
    }

    public __updatePath(): void { }

    public __drawPathByData(drawer: ICanvasDrawPath, data: IPathCommandData): void {
        const { width, height, borderRadius } = this.__
        if (borderRadius) {
            drawer.roundRect(0, 0, width, height, borderRadius)
        } else {
            drawer.rect(0, 0, width, height)
        }
    }
}