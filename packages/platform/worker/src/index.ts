export * from '@leafer-ui/interface'

export * from './core'
export * from '@leafer/partner'

export * from '@leafer-ui/core'
export * from '@leafer-ui/partner'

import { ICreator } from '@leafer/interface'
import { useCanvas, Creator, LeaferCanvas } from './core'
import { HitCanvasManager, InteractionBase } from '@leafer-ui/core'


Object.assign(Creator, {
    interaction: (target, canvas, selector, options?) => new InteractionBase(target, canvas, selector, options),
    hitCanvas: (options?, manager?) => new LeaferCanvas(options, manager),
    hitCanvasManager: () => new HitCanvasManager()
} as ICreator)

useCanvas('canvas')