import { ILeaferCanvas } from '@leafer/interface'

import { IUI } from '@leafer-ui/interface'

export function blur(ui: IUI, current: ILeaferCanvas, origin: ILeaferCanvas): void {
    const { blur } = ui.__
    origin.setWorldBlur(blur * ui.__nowWorld.a)
    origin.copyWorldToInner(current, ui.__nowWorld, ui.__layout.renderBounds)
    origin.filter = 'none'
}
