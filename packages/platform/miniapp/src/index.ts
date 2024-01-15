export * from '@leafer/miniapp'
export * from '@leafer/interaction-miniapp'
export * from '@leafer/partner'

export * from '@leafer-ui/core'
export * from '@leafer-ui/partner'

import { ICreator } from '@leafer/interface'
import { useCanvas, Creator, LeaferCanvas } from '@leafer/miniapp'
import { Interaction, HitCanvasManager } from '@leafer/interaction-miniapp'


Object.assign(Creator, {
    interaction: (target, canvas, selector, options?) => new Interaction(target, canvas, selector, options),
    hitCanvas: (options?, manager?) => new LeaferCanvas(options, manager),
    hitCanvasManager: () => new HitCanvasManager()
} as ICreator)

try {
    useCanvas('wx', wx)
} catch { }