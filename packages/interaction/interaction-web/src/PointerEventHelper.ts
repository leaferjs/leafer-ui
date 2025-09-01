import { IPointData, IPointerEvent, PointerType } from '@leafer/interface'
import { InteractionHelper } from '@leafer-ui/core'


export const PointerEventHelper = {

    convert(e: PointerEvent, local: IPointData): IPointerEvent {
        const base = InteractionHelper.getBase(e), { x, y } = local
        const data: IPointerEvent = {
            ...base,
            x,
            y,
            width: e.width,
            height: e.height,
            pointerType: e.pointerType as PointerType,
            pressure: e.pressure,
        }

        if (data.pointerType === 'pen') {
            data.tangentialPressure = e.tangentialPressure
            data.tiltX = e.tiltX
            data.tiltY = e.tiltY
            data.twist = e.twist
        }
        return data
    },

    convertMouse(e: MouseEvent, local: IPointData): IPointerEvent {
        const base = InteractionHelper.getBase(e), { x, y } = local
        return {
            ...base,
            x,
            y,
            width: 1,
            height: 1,
            pointerType: 'mouse',
            pressure: 0.5,
        }
    },

    convertTouch(e: TouchEvent, local: IPointData): IPointerEvent {
        const touch = PointerEventHelper.getTouch(e)
        const base = InteractionHelper.getBase(e), { x, y } = local
        return {
            ...base,
            x,
            y,
            width: 1,
            height: 1,
            pointerType: 'touch',
            multiTouch: e.touches.length > 1,
            pressure: touch.force,
        }
    },

    getTouch(e: TouchEvent): Touch {
        return e.targetTouches[0] || e.changedTouches[0]
    }

}