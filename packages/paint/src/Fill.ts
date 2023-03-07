import { ILeaferCanvas } from '@leafer/interface'

import { ILeafPaint, IUI } from '@leafer-ui/interface'


export function fill(ui: IUI, canvas: ILeaferCanvas, fill: string | object): void {
    canvas.fillStyle = fill
    canvas.fill(ui.__.windingRule)

}

export function fills(ui: IUI, canvas: ILeaferCanvas, fills: ILeafPaint[]): void {
    let item: ILeafPaint
    const { windingRule } = ui.__
    for (let i = 0, len = fills.length; i < len; i++) {
        item = fills[i]
        canvas.fillStyle = item.style
        canvas.fill(windingRule)
    }
}