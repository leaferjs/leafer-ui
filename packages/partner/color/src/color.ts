import { isString, isNumber, isUndefined } from '@leafer/core'

import { IColor } from '@leafer-ui/interface'
import { ColorConvert } from '@leafer-ui/draw'


export function string(color: IColor, opacity?: number): string {
    if (!color) return '#000'
    const doOpacity = isNumber(opacity) && opacity < 1
    if (isString(color)) {
        if (doOpacity && ColorConvert.object) color = ColorConvert.object(color)
        else return color
    }
    let a = isUndefined(color.a) ? 1 : color.a
    if (doOpacity) a *= opacity
    const rgb = color.r + ',' + color.g + ',' + color.b
    return a === 1 ? 'rgb(' + rgb + ')' : 'rgba(' + rgb + ',' + a + ')'
}