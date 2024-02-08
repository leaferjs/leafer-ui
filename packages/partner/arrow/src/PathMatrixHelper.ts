import { IPathCommandData, IPointData } from '@leafer/interface'
import { PathCommandMap as Command, PointHelper } from '@leafer/core'


const { M, L, C, Q, Z, N, D, X, G, F, O, P, U } = Command
const { rotate } = PointHelper

export const PathMatrixHelper = {
    layout(data: IPathCommandData, x: number, y: number, scaleX?: number, scaleY?: number, rotation?: number, center?: IPointData): void {
        let command: number
        let i = 0, len = data.length, point: IPointData = {} as IPointData

        while (i < len) {
            command = data[i]
            switch (command) {
                case M:  //moveto(x, y)
                case L:  //lineto(x, y)
                    point.x = data[i + 1]
                    point.y = data[i + 2]
                    if (rotation) rotate(point, rotation, center)
                    if (scaleX) {
                        point.x *= scaleX
                        point.y *= scaleY
                    }
                    data[i + 1] = x + point.x
                    data[i + 2] = y + point.y
                    i += 3
                    break
                case C:  //bezierCurveTo(x1, y1, x2, y2, x, y)
                    i += 7
                    break
                case Q:  //quadraticCurveTo(x1, y1, x, y)
                    i += 5
                    break
                case Z:  //closepath()
                    i += 1
                    break

                // canvas command

                case N: // rect(x, y, width, height)
                    i += 5
                    break
                case D: // roundRect(x, y, width, height, radius1, radius2, radius3, radius4)
                    i += 9
                    break
                case X: // simple roundRect(x, y, width, height, radius)
                    i += 6
                    break
                case G: // ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise)
                    i += 9
                    break
                case F: // simple ellipse(x, y, radiusX, radiusY)
                    i += 5
                    break
                case O: // arc(x, y, radius, startAngle, endAngle, anticlockwise)
                    data[i + 1] += x
                    data[i + 2] += y
                    if (scaleX) data[i + 3] *= scaleX
                    if (rotation) {
                        data[i + 4] += rotation
                        data[i + 5] += rotation
                    }
                    i += 7
                    break
                case P: // simple arc(x, y, radius)
                    break
                case U: // arcTo(x1, y1, x2, y2, radius)
                    i += 6
                    break
            }
        }
    },
    rotate(data: IPathCommandData, rotation?: number, center?: IPointData): void {
        PathMatrixHelper.layout(data, 0, 0, 1, 1, rotation, center)
    }
}
