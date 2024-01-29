import { ISwipeEvent } from '@leafer/interface'
import { registerUIEvent } from '@leafer/core'

import { DragEvent } from './DragEvent'


@registerUIEvent()
export class SwipeEvent extends DragEvent implements ISwipeEvent {

    static SWIPE = 'swipe'

    static LEFT = 'swipe.left'
    static RIGHT = 'swipe.right'
    static UP = 'swipe.up'
    static DOWN = 'swipe.down'

    readonly speed: number
    readonly direction: string

}