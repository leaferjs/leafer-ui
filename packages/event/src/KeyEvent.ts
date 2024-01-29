import { IKeyEvent } from '@leafer/interface'
import { registerUIEvent } from '@leafer/core'

import { UIEvent } from './UIEvent'


@registerUIEvent()
export class KeyEvent extends UIEvent implements IKeyEvent {

    static DOWN = 'key.down'
    static HOLD = 'key.hold'
    static UP = 'key.up'

    public readonly code: string
    public readonly key: string

}