import { ILeaferBase } from '@leafer/interface'


export function draw(leafer: ILeaferBase): void {
    const { config } = leafer
    config.move.dragOut = false
}
