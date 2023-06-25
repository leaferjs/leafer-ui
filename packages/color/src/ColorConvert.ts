import { IColor } from '@leafer-ui/interface'

export const ColorConvert = {
    string(color: IColor, opacity?: number): string {
        if (typeof color === 'string') return color
        let a = color.a === undefined ? 1 : color.a
        if (opacity) a *= opacity
        const rgb = color.r + ',' + color.g + ',' + color.b
        return a === 1 ? 'rgb(' + rgb + ')' : 'rgba(' + rgb + ',' + a + ')'
    }
}