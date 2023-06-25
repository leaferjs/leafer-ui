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

            const { strokeAlign, strokeWidth } = this.__
            canvas.setStroke(stroke, strokeWidth, this.__)
            const half = strokeWidth / 2

            switch (strokeAlign) {
                case 'center':
                    canvas.strokeRect(0, 0, width, height)
                    break
                case 'inside':
                    canvas.strokeRect(half, half, width - strokeWidth, height - strokeWidth)
                    break
                case 'outside':
                    canvas.strokeRect(-half, -half, width + strokeWidth, height + strokeWidth)
                    break
            }
        }

    }
}
