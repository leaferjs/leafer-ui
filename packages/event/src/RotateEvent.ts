import { IRotateEvent } from '@leafer/interface'
import { registerUIEvent } from '@leafer/core'

import { UIEvent } from './UIEvent'


@registerUIEvent()
export class RotateEvent extends UIEvent implements IRotateEvent {

    static BEFORE_ROTATE = 'rotate.before_rotate'

    static START = 'rotate.start'
    static ROTATE = 'rotate'
    static END = 'rotate.end'

    readonly rotation: number

}