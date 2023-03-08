import { ILeaferCanvas, IRenderOptions } from '@leafer/interface'

import { IUIRenderModule } from '@leafer-ui/interface'


export const TextRender: IUIRenderModule = {

    __drawFast(canvas: ILeaferCanvas, _options: IRenderOptions): void {

        const { fill, stroke, content, __font } = this.__

        canvas.font = __font

        if (fill) {
            canvas.fillStyle = fill
            canvas.fillText(content, 0, 0)
        }

        if (stroke) {
            canvas.strokeStyle = stroke
            canvas.strokeText(content, 0, 0)
        }
    }

}

TextRender.__draw = TextRender.__drawFast
