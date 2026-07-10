import { ILeaferCanvas } from '@leafer/interface'
import { Text } from '@leafer-ui/draw'


Text.prototype.__drawHitPath = function (canvas: ILeaferCanvas): void {
    const data = this.__, { __lineHeight, fontSize, __baseLine, __letterSpacing, __textDrawData: drawData } = data

    canvas.beginPath()

    if (data.motionText) this.__drawPathByData(canvas, data.__pathForMotionText)
    else if (__letterSpacing < 0) this.__drawPathByBox(canvas)
    else drawData.rows.forEach(row => canvas.rect(row.x, row.y - __baseLine, row.width, __lineHeight < fontSize ? fontSize : __lineHeight))
}