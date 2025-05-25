export function hasTransparent(color?: string): boolean {

    if (!color || color.length === 7 || color.length === 4) return false
    if (color === 'transparent') return true  // transparent keyword

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

    }

    return false

}