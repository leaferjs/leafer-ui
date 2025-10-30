import { ITouchEvent } from '@leafer/interface'
import { registerUIEvent } from '@leafer/core'

import { UIEvent } from './UIEvent'


@registerUIEvent()
export class TouchEvent extends UIEvent implements ITouchEvent {

}

export const MyTouchEvent = TouchEvent