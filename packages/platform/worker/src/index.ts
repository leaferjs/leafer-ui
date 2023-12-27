export * from '@leafer/worker'
export * from '@leafer-ui/core'
export * from '@leafer-ui/partner'

import { useCanvas, Creator, InteractionBase, LeaferCanvas } from '@leafer/worker'
import { ICreator } from '@leafer/interface'

Object.assign(Creator, {
    interaction: (target, canvas, selector, options?) => new InteractionBase(target, canvas, selector, options),
    hitCanvas: (options?, manager?) => new LeaferCanvas(options, manager)
} as ICreator)

useCanvas('canvas')