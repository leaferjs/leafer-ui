import { ILeaferBase } from '@leafer/interface'
import { addInteractionWindow } from './window'


export function document(leafer: ILeaferBase): void {
    addInteractionWindow(leafer)
    const { move, zoom } = leafer.config
    move.scroll = 'limit'
    zoom.min = 1
}
