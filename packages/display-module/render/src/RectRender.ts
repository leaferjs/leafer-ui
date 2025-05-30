import { ILeaferCanvas, IRenderOptions } from '@leafer/interface'

import { IRectRenderModule } from '@leafer-ui/interface'


export const RectRender: IRectRenderModule = {

    __drawFast(canvas: ILeaferCanvas, options: IRenderOptions): void {

        let { x, y, width, height } = this.__layout.boxBounds
        const { fill, stroke, __drawAfterFill } = this.__

        if (fill) {
            canvas.fillStyle = fill
            canvas.fillRect(x, y, width, height)
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
                    width -= __strokeWidth, height -= __strokeWidth
                    if (width < 0 || height < 0) {
                        canvas.save()
                        this.__clip(canvas, options)
                        canvas.strokeRect(x + half, y + half, width, height)
                        canvas.restore()
                    } else canvas.strokeRect(x + half, y + half, width, height)
                    break
                case 'outside':
                    canvas.strokeRect(x - half, y - half, width + __strokeWidth, height + __strokeWidth)
                    break
            }

        }

    }
}
