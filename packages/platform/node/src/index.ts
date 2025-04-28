export * from '@leafer-ui/interface'

export * from './core'
export * from '@leafer/partner'

export * from '@leafer-ui/core'
export * from '@leafer-ui/partner'

export * from '@leafer-in/export'

import { ICreator } from '@leafer/interface'
import { Creator, LeaferCanvas } from './core'
import { InteractionBase, HitCanvasManager } from '@leafer-ui/core'


Object.assign(Creator, {
    interaction: (target, canvas, selector, options?) => { return new InteractionBase(target, canvas, selector, options) },
    hitCanvas: (options?, manager?) => new LeaferCanvas(options, manager),
    hitCanvasManager: () => new HitCanvasManager()
} as ICreator)
