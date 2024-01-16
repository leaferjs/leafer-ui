import { IPathCommandData } from '@leafer/interface'

import { PathCommandMap as Command } from '@leafer-ui/draw'


const { M, L, C, Q, Z, N, D, X, G, F, O, P, U } = Command

export const PathScaler = {

    scale(data: IPathCommandData, scaleX: number, scaleY: number): void {
        if (!data) return

        let command: number
        let i = 0, len = data.length

        while (i < len) {
            command = data[i]
            switch (command) {
                case M:  //moveto(x, y)
                    scalePoints(data, scaleX, scaleY, i, 1)
                    i += 3
                    break
                case L:  //lineto(x, y)
                    scalePoints(data, scaleX, scaleY, i, 1)
                    i += 3
                    break
                case C:  //bezierCurveTo(x1, y1, x2, y2, x, y)
                    scalePoints(data, scaleX, scaleY, i, 3)
                    i += 7
                    break
                case Q:  //quadraticCurveTo(x1, y1, x, y)
                    scalePoints(data, scaleX, scaleY, i, 2)
                    i += 5
                    break
                case Z:  //closepath()
                    i += 1
                    break

                // canvas command

                case N: // rect(x, y, width, height)
                    scalePoints(data, scaleX, scaleY, i, 2)
                    i += 5
                    break
                case D: // roundRect(x, y, width, height, radius1, radius2, radius3, radius4)
                    scalePoints(data, scaleX, scaleY, i, 2)
                    i += 9
                    break
                case X: // simple roundRect(x, y, width, height, radius)
                    scalePoints(data, scaleX, scaleY, i, 2)
                    i += 6
                    break
                case G: // ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise)
                    scalePoints(data, scaleX, scaleY, i, 2)
                    i += 9
                    break
                case F: // simple ellipse(x, y, radiusX, radiusY)
                    scalePoints(data, scaleX, scaleY, i, 2)
                    i += 5
                    break
                case O: // arc(x, y, radius, startAngle, endAngle, anticlockwise)
                    data[i] = G // to ellipse
                    data.splice(i + 4, 0, data[i + 3], 0)
                    scalePoints(data, scaleX, scaleY, i, 2)
                    i += 7 + 2
                    len += 2
                    break
                case P: // simple arc(x, y, radius)
                    data[i] = F // to simple ellipse
                    data.splice(i + 4, 0, data[i + 3])
                    scalePoints(data, scaleX, scaleY, i, 2)
                    i += 4 + 1
                    len += 1
                    break
                case U: // arcTo(x1, y1, x2, y2, radius)
                    scalePoints(data, scaleX, scaleY, i, 2)
                    i += 6
                    break
            }
        }

    },

    scalePoints(data: IPathCommandData, scaleX: number, scaleY: number, start?: number, pointCount?: number): void {
        for (let i = pointCount ? start + 1 : 0, end = pointCount ? i + pointCount * 2 : data.length; i < end; i += 2) {
            data[i] *= scaleX
            data[i + 1] *= scaleY
        }
    }

}

const { scalePoints } = PathScaler