import { IInteractionConfig } from '@leafer/interface'

export const config: IInteractionConfig = {
    wheel: {
        zoomMode: false,
        zoomSpeed: 0.5,
        moveSpeed: 0.5,
        rotateSpeed: 0.5,
        delta: { x: 80 / 4, y: 8.0 }, // 基准速度（会影响zoomSpeed)，可根据不同系统、浏览器细化定制
        preventDefault: true
    },
    pointer: {
        hitRadius: 5,
        through: false,
        tapTime: 120,
        longPressTime: 800,
        transformTime: 500,
        dragHover: true,
        dragDistance: 2,
        swipeDistance: 20,
        ignoreMove: false,
        preventDefaultMenu: true
    },
    cursor: {}
}