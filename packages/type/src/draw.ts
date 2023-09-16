import { ILeafer } from '@leafer/interface'


export function draw(leafer: ILeafer): void {
    const { config } = leafer
    config.move.dragOut = false
}
