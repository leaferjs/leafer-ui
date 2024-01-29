import { IPointerEvent, PointerType } from '@leafer/interface'
import { registerUIEvent } from '@leafer/core'

import { UIEvent } from './UIEvent'


@registerUIEvent()
export class PointerEvent extends UIEvent implements IPointerEvent {

    static POINTER = 'pointer'

    static BEFORE_DOWN = 'pointer.before_down'
    static BEFORE_MOVE = 'pointer.before_move'
    static BEFORE_UP = 'pointer.before_up'

    static DOWN = 'pointer.down'
    static MOVE = 'pointer.move'
    static UP = 'pointer.up'

    static OVER = 'pointer.over'
    static OUT = 'pointer.out'

    static ENTER = 'pointer.enter'
    static LEAVE = 'pointer.leave'

    static TAP = 'tap'
    static DOUBLE_TAP = 'double_tap'

    static CLICK = 'click'
    static DOUBLE_CLICK = 'double_click'

    static LONG_PRESS = 'long_press'
    static LONG_TAP = 'long_tap'

    static MENU = 'pointer.menu'
    static MENU_TAP = 'pointer.menu_tap'

    public readonly width: number
    public readonly height: number
    public readonly pointerType: PointerType
    public readonly pressure: number
    public readonly tangentialPressure?: number
    public readonly tiltX?: number
    public readonly tiltY?: number
    public readonly twist?: number

}