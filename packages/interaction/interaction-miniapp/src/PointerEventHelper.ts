import { IPointData, IPointerEvent } from '@leafer/interface'
import { InteractionHelper } from '@leafer-ui/core'


export const PointerEventHelper = {

    convertTouch(e: TouchEvent, local: IPointData): IPointerEvent {
        const touch = PointerEventHelper.getTouch(e)
        const base = InteractionHelper.getBase(e)
        return {
            ...base,
            x: local.x,
            y: local.y,
            width: 1,
            height: 1,
            pointerType: 'touch',
            multiTouch: e.touches.length > 1,
            pressure: touch.force || 1,
        }
    },

    getTouch(e: TouchEvent): Touch {
        return e.touches[0] || e.changedTouches[0]
    }

}