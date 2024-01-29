import { IUIEvent } from '@leafer/interface'


export const PointerButton = {

    LEFT: 1,

    RIGHT: 2,

    MIDDLE: 4,

    defaultLeft(event: IUIEvent): void { if (!event.buttons) event.buttons = 1 },

    left(event: IUIEvent): boolean { return event.buttons === 1 },

    right(event: IUIEvent): boolean { return event.buttons === 2 },

    middle(event: IUIEvent): boolean { return event.buttons === 4 }

}