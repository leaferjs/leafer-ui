export * from '@leafer-ui/interface'

export * from './core'
export * from '@leafer/partner'

export * from '@leafer-ui/core'
export * from '@leafer-ui/interaction-web'
export * from '@leafer-ui/partner'

import { ICreator } from '@leafer/interface'
import { useCanvas, Creator, LeaferCanvas } from './core'
import { HitCanvasManager } from '@leafer-ui/core'
import { Interaction } from '@leafer-ui/interaction-web'


Object.assign(Creator, {
    interaction: (target, canvas, selector, options?) => new Interaction(target, canvas, selector, options),
    hitCanvas: (options?, manager?) => new LeaferCanvas(options, manager),
    hitCanvasManager: () => new HitCanvasManager()
} as ICreator)

useCanvas('canvas')