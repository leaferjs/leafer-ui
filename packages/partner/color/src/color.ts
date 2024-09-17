import { IColor } from '@leafer-ui/interface'
import { ColorConvert } from '@leafer-ui/draw'


export function string(color: IColor, opacity?: number): string {
    const doOpacity = typeof opacity === 'number' && opacity !== 1
    if (typeof color === 'string') {
        if (doOpacity && ColorConvert.object) color = ColorConvert.object(color)
        else return color
    }
    let a = color.a === undefined ? 1 : color.a
    if (doOpacity) a *= opacity
    const rgb = color.r + ',' + color.g + ',' + color.b
    return a === 1 ? 'rgb(' + rgb + ')' : 'rgba(' + rgb + ',' + a + ')'
}