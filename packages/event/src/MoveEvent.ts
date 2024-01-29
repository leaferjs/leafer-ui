import { IMoveEvent } from '@leafer/interface'
import { registerUIEvent } from '@leafer/core'

import { DragEvent } from './DragEvent'

@registerUIEvent()
export class MoveEvent extends DragEvent implements IMoveEvent {

    static BEFORE_MOVE = 'move.before_move'

    static START = 'move.start'
    static MOVE = 'move'
    static END = 'move.end'

}