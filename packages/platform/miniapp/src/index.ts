export * from '@leafer-ui/interface'

export * from './core'
export * from '@leafer/partner'

export * from '@leafer-ui/core'
export * from '@leafer-ui/interaction-miniapp'
export * from '@leafer-ui/partner'

import { ICreator } from '@leafer/interface'
import { useCanvas, Creator, LeaferCanvas } from './core'
import { Leafer } from '@leafer-ui/draw'
import { HitCanvasManager } from '@leafer-ui/core'
import { Interaction } from '@leafer-ui/interaction-miniapp'


Object.assign(Creator, {
    interaction: (target, canvas, selector, options?) => new Interaction(target, canvas, selector, options),
    hitCanvas: (options?, manager?) => new LeaferCanvas(options, manager),
    hitCanvasManager: () => new HitCanvasManager()
} as ICreator)

Leafer.prototype.receiveEvent = function (event: any): void {
    this.interaction && this.interaction.receive(event)
}

try {
    if (wx) useCanvas('miniapp', wx)
} catch { }