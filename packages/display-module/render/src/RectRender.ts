import { ILeaferCanvas, IRenderOptions } from '@leafer/interface'

import { IRectRenderModule } from '@leafer-ui/interface'


export const RectRender: IRectRenderModule = {

    __drawFast(canvas: ILeaferCanvas, options: IRenderOptions): void {

        const { width, height, fill, stroke, __drawAfterFill } = this.__

        if (fill) {
            canvas.fillStyle = fill
            canvas.fillRect(0, 0, width, height)
        }

        if (__drawAfterFill) this.__drawAfterFill(canvas, options)

        if (stroke) {

            const { strokeAlign, __strokeWidth } = this.__
            if (!__strokeWidth) return

            canvas.setStroke(stroke, __strokeWidth, this.__)
            const half = __strokeWidth / 2

            switch (strokeAlign) {
                case 'center':
                    canvas.strokeRect(0, 0, width, height)
                    break
                case 'inside':
                    canvas.strokeRect(half, half, width - __strokeWidth, height - __strokeWidth)
                    break
                case 'outside':
                    canvas.strokeRect(-half, -half, width + __strokeWidth, height + __strokeWidth)
                    break
            }
        }

    }
}
