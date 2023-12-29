export * from '@leafer/web'
export * from '@leafer/interaction-web'

export * from '@leafer-ui/core'
export * from '@leafer-ui/partner'

import { ICreator } from '@leafer/interface'
import { useCanvas, Creator, LeaferCanvas } from '@leafer/web'
import { Interaction } from '@leafer/interaction-web'


Object.assign(Creator, {
    interaction: (target, canvas, selector, options?) => new Interaction(target, canvas, selector, options),
    hitCanvas: (options?, manager?) => new LeaferCanvas(options, manager)
} as ICreator)

useCanvas('canvas')