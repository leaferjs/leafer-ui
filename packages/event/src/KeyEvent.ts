import { IKeyCodes, IKeyEvent } from '@leafer/interface'
import { registerUIEvent } from '@leafer/core'

import { UIEvent } from './UIEvent'


@registerUIEvent()
export class KeyEvent extends UIEvent implements IKeyEvent {

    static BEFORE_DOWN = 'key.before_down'
    static BEFORE_UP = 'key.before_up'

    static DOWN = 'key.down'
    static HOLD = 'key.hold'
    static UP = 'key.up'

    public readonly code: IKeyCodes
    public readonly key: string

}