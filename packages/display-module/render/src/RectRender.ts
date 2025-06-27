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

            const { strokeAlign, __strokeWidth: strokeWidth } = this.__
            if (!strokeWidth) return

            canvas.setStroke(stroke, strokeWidth, this.__)
            const half = strokeWidth / 2

            switch (strokeAlign) {
                case 'center':
                    canvas.strokeRect(0, 0, width, height)
                    break
                case 'inside':
                    width -= strokeWidth, height -= strokeWidth
                    if (width < 0 || height < 0) {
                        canvas.save()
                        this.__clip(canvas, options)
                        canvas.strokeRect(x + half, y + half, width, height)
                        canvas.restore()
                    } else canvas.strokeRect(x + half, y + half, width, height)
                    break
                case 'outside':
                    canvas.strokeRect(x - half, y - half, width + strokeWidth, height + strokeWidth)
                    break
            }

        }

    }
}
