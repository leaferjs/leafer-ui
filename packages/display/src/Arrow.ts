import { registerUI, strokeType, dataProcessor } from '@leafer/core'

import { IArrow, IArrowData, IArrowInputData, IArrowType } from '@leafer-ui/interface'
import { ArrowData } from '@leafer-ui/data'

import { Line } from './Line'


@registerUI()
export class Arrow extends Line implements IArrow {

    public get __tag() { return 'Arrow' }

    @dataProcessor(ArrowData)
    declare public __: IArrowData

    @strokeType('none')
    declare public startArrow: IArrowType

    @strokeType('lines')
    declare public endArrow: IArrowType

    constructor(data?: IArrowInputData) {
        super(data)
    }

}