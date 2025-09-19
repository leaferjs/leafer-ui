import { IZoomEvent } from '@leafer/interface'
import { registerUIEvent } from '@leafer/core'

import { PointerEvent } from './PointerEvent'

@registerUIEvent()
export class ZoomEvent extends PointerEvent implements IZoomEvent {

    static BEFORE_ZOOM = 'zoom.before_zoom'

    static START = 'zoom.start'
    static ZOOM = 'zoom'
    static END = 'zoom.end'

    readonly scale: number
    readonly totalScale: number

}