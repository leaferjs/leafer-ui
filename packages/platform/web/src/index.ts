export * from '@leafer/web'
export * from '@leafer/partner'

export * from '@leafer-ui/core'
export * from '@leafer-ui/interaction-web'
export * from '@leafer-ui/partner'

import { ICreator } from '@leafer/interface'
import { useCanvas, Creator, LeaferCanvas, ImageManager } from '@leafer/web'
import { HitCanvasManager, Leafer } from '@leafer-ui/core'
import { Interaction } from '@leafer-ui/interaction-web'


Object.assign(Creator, {
    interaction: (target, canvas, selector, options?) => new Interaction(target, canvas, selector, options),
    hitCanvas: (options?, manager?) => new LeaferCanvas(options, manager),
    hitCanvasManager: () => new HitCanvasManager()
} as ICreator)

useCanvas('canvas')

// chrome 刷新页面时不会销毁实例，需要主动销毁
window.addEventListener('unload', () => {
    const { list } = Leafer
    list.forEach(leafer => (leafer as Leafer).destroy(true))
    list.destroy()
    ImageManager.destroy()
})