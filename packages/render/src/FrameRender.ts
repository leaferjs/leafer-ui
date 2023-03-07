import { ILeaferCanvas, IRenderOptions } from '@leafer/interface'

import { IFrameRenderModule } from '@leafer-ui/interface'


export const FrameRender: IFrameRenderModule = {

    __render(canvas: ILeaferCanvas, options: IRenderOptions): void {

        const { fill, stroke } = this.__

        if (stroke) this.__.stroke = undefined

        this.__renderRect(canvas, options)

        const { clip } = this.__
        if (clip) {
            canvas.save()
            canvas.clip()

            this.__renderGroup(canvas, options)

            canvas.restore()
        } else {
            this.__renderGroup(canvas, options)

        }


        if (stroke) {
            this.__.stroke = stroke

            if (fill) this.__.fill = undefined
            this.__renderRect(canvas, options)
            if (fill) this.__.fill = fill
        }

    }

}