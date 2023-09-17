import { ILeaferCanvas } from '@leafer/interface'

import { IUI } from '@leafer-ui/interface'

export function blur(ui: IUI, current: ILeaferCanvas, origin: ILeaferCanvas): void {
    const { blur } = ui.__
    origin.setWorldBlur(blur * ui.__world.a)
    origin.copyWorldToInner(current, ui.__world, ui.__layout.renderBounds)
    origin.filter = 'none'
}
