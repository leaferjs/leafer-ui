import { IRotateEvent } from '@leafer/interface'
import { registerUIEvent } from '@leafer/core'

import { PointerEvent } from './PointerEvent'


@registerUIEvent()
export class RotateEvent extends PointerEvent implements IRotateEvent {

    static BEFORE_ROTATE = 'rotate.before_rotate'

    static START = 'rotate.start'
    static ROTATE = 'rotate'
    static END = 'rotate.end'

    readonly rotation: number
    readonly totalRotation: number

}