import { IPointData, IWheelConfig } from '@leafer/interface'
import { MathHelper, Platform } from '@leafer/core'


export const WheelEventHelper = {

    getMove(e: WheelEvent, config: IWheelConfig): IPointData {
        let { moveSpeed } = config
        let { deltaX, deltaY } = e
        if (e.shiftKey && !deltaX) { // Window
            deltaX = deltaY
            deltaY = 0
        }
        if (deltaX > 50) deltaX = Math.max(50, deltaX / 3)
        if (deltaY > 50) deltaY = Math.max(50, deltaY / 3)
        return { x: -deltaX * moveSpeed * 2, y: -deltaY * moveSpeed * 2 }
    },

    getScale(e: WheelEvent, config: IWheelConfig): number {

        let zoom: boolean
        let scale = 1
        let { zoomMode, zoomSpeed } = config

        const delta = e.deltaY || e.deltaX

        if (zoomMode) {
            // mac 触摸板滚动手势的deltaY是整数, 鼠标滚动/触摸板缩放的deltaY有小数点， firfox鼠标滚动为整数，为18或19的倍数
            // windows 始终是整数
            zoom = (zoomMode === 'mouse') ? true : (!e.deltaX && (Platform.intWheelDeltaY ? Math.abs(delta) > 17 : Math.ceil(delta) !== delta))
            if (e.shiftKey || e.metaKey || e.ctrlKey) zoom = true
        } else {
            zoom = !e.shiftKey && (e.metaKey || e.ctrlKey)
        }

        if (zoom) {
            zoomSpeed = MathHelper.within(zoomSpeed, 0, 1)
            const min = e.deltaY ? config.delta.y : config.delta.x
            scale = 1 - delta / (min * 4) * zoomSpeed // zoomSpeed
            if (scale < 0.5) scale = 0.5
            if (scale >= 1.5) scale = 1.5
        }

        return scale
    }

}