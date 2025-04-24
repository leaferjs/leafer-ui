import { ILeaferCanvas } from '@leafer/interface'
import { Text } from '@leafer-ui/draw'


Text.prototype.__drawHitPath = function (canvas: ILeaferCanvas): void {
    const { __lineHeight, fontSize, __baseLine, __letterSpacing, __textDrawData: data } = this.__

    canvas.beginPath()

    if (__letterSpacing < 0) this.__drawPathByBox(canvas)
    else data.rows.forEach(row => canvas.rect(row.x, row.y - __baseLine, row.width, __lineHeight < fontSize ? fontSize : __lineHeight))
}

