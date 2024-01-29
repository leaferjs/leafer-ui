import { IZoomEvent } from '@leafer/interface'
import { registerUIEvent } from '@leafer/core'

import { UIEvent } from './UIEvent'

@registerUIEvent()
export class ZoomEvent extends UIEvent implements IZoomEvent {

    static BEFORE_ZOOM = 'zoom.before_zoom'

    static START = 'zoom.start'
    static ZOOM = 'zoom'
    static END = 'zoom.end'

    readonly scale: number

}