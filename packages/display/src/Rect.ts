import { dataProcessor, registerUI, rewriteAble, useModule } from '@leafer/core'

import { IRect, IRectInputData, IRectData } from '@leafer-ui/interface'
import { RectData } from '@leafer-ui/data'
import { RectRender } from '@leafer-ui/display-module'

import { UI } from './UI'


@useModule(RectRender)
@rewriteAble()
@registerUI()
export class Rect<TInputData = IRectInputData> extends UI<TInputData> implements IRect { // tip: rewrited Box

    public get __tag() { return 'Rect' }

    @dataProcessor(RectData)
    declare public __: IRectData

}