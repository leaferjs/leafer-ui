import { IMoveEvent } from '@leafer/interface'
import { registerUIEvent } from '@leafer/core'

import { DragEvent } from './DragEvent'

@registerUIEvent()
export class MoveEvent extends DragEvent implements IMoveEvent {

    static BEFORE_MOVE = 'move.before_move'

    static START = 'move.start'
    static MOVE = 'move'
    static DRAG_ANIMATE = 'move.drag_animate'
    static END = 'move.end'

    static PULL_DOWN = 'move.pull_down'
    static REACH_BOTTOM = 'move.reach_bottom'

    readonly moveType: 'drag' | 'move'
}