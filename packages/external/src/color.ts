import { IColor } from '@leafer-ui/interface'

export function hasTransparent(color: IColor): boolean {

    return typeof color === 'object' ? color.a !== undefined && color.a < 1 : hasTransparentStr(color)

}

export function hasTransparentStr(color?: string): boolean {

    if (!color || color.length === 7) return false

    const first = color[0]

    if (first === '#') {

        // hex
        switch (color.length) {
            case 5: return color[4] !== 'f' && color[4] !== 'F' // #RGBA
            case 9: return (color[7] !== 'f' && color[7] !== 'F') || (color[8] !== 'f' && color[8] !== 'F') // #RRGGBBAA
        }

    } else if (first === 'r' || first === 'h') {

        // rgba(...) or hsla(...)
        if (color[3] === 'a') {
            const i = color.lastIndexOf(',')
            if (i > -1) return parseFloat(color.slice(i + 1)) < 1
        }

    } else if (color === 'transparent') return true  // transparent keyword


    return false

}