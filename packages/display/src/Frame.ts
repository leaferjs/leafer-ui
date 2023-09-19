import { __Boolean } from '@leafer/interface'
import { dataProcessor, registerUI, affectRenderBoundsType } from '@leafer/core'

import { IFrame, IFrameData, IFrameInputData, IOverflow } from '@leafer-ui/interface'
import { FrameData } from '@leafer-ui/data'

import { Box } from './Box'


@registerUI()
export class Frame extends Box implements IFrame {

    public get __tag() { return 'Frame' }

    @dataProcessor(FrameData)
    declare public __: IFrameData

    @affectRenderBoundsType('hide')
    declare public overflow: IOverflow

    constructor(data?: IFrameInputData) {
        super(data)
        if (!this.__.fill) this.__.fill = '#FFFFFF'
    }
}
