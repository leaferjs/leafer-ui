export * from '@leafer/worker'
export * from '@leafer/partner'

export * from '@leafer-ui/core'
export * from '@leafer-ui/partner'

import { ICreator } from '@leafer/interface'
import { useCanvas, Creator, LeaferCanvas } from '@leafer/worker'
import { InteractionBase } from '@leafer/interaction'


Object.assign(Creator, {
    interaction: (target, canvas, selector, options?) => new InteractionBase(target, canvas, selector, options),
    hitCanvas: (options?, manager?) => new LeaferCanvas(options, manager)
} as ICreator)

useCanvas('canvas')