import { dataProcessor, registerUI, affectRenderBoundsType, surfaceType } from '@leafer/core'

import { IFrame, IFrameData, IFrameInputData, IFill, IOverflow } from '@leafer-ui/interface'
import { FrameData } from '@leafer-ui/data'

import { Box } from './Box'


@registerUI()
export class Frame<TInputData = IFrameInputData> extends Box<TInputData> implements IFrame {

    public get __tag() { return 'Frame' }

    public get isFrame(): boolean { return true }

    @dataProcessor(FrameData)
    declare public __: IFrameData

    @surfaceType('#FFFFFF')
    declare public fill?: IFill

    @affectRenderBoundsType('hide')
    declare public overflow?: IOverflow

}
