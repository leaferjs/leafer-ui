import { ILeafer } from '@leafer/interface'


export function user(leafer: ILeafer): void {
    const { config } = leafer
    config.move.dragOut = false
}
