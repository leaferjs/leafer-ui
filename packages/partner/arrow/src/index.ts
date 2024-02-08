import { IPathCommandData, IPointData } from '@leafer/interface'
import { IPathArrowModule, IUI } from '@leafer-ui/interface'
import { PathCommandMap as Command, PointHelper, getPointData } from '@leafer/core'
import { arrows, getArrowPath } from './arrows'


const { M, L, C, Q, Z, N, D, X, G, F, O, P, U } = Command
const { copy, copyFrom, getDistancePoint, } = PointHelper

const connectPoint = getPointData()
const first = getPointData(), second = getPointData()
const last = getPointData(), now = getPointData()

export const PathArrowModule: IPathArrowModule = {

    list: arrows,

    add(ui: IUI, data: IPathCommandData): IPathCommandData {
        const { startArrow, endArrow, strokeWidth } = ui.__
        let command: number, i = 0, len = data.length, count = 0, useStartArrow = startArrow && startArrow !== 'none'

        while (i < len) {

            command = data[i]

            switch (command) {
                case M:  // moveto(x, y)
                case L:  // lineto(x, y)
                    if (count < 2 || i + 3 === len) {
                        copyFrom(now, data[i + 1], data[i + 2])
                        if (!count && useStartArrow) copy(first, now)
                    }
                    i += 3
                    break
                case C:  // bezierCurveTo(x1, y1, x2, y2, x, y)
                    if (count === 1 || i + 7 === len) copyPoints(data, last, now, i + 3)
                    i += 7
                    break
                case Q:  // quadraticCurveTo(x1, y1, x, y)
                    if (count === 1 || i + 5 === len) copyPoints(data, last, now, i + 1)
                    i += 5
                    break
                case Z:  // closepath()
                    return data // no arrow

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
                    i += 7
                    break
                case P: // simple arc(x, y, radius)
                    i += 4
                    break
                case U: // arcTo(x1, y1, x2, y2, radius)
                    if (count === 1 || i + 6 === len) copyPoints(data, last, now, i + 1)
                    i += 6
                    break
            }

            count++

            if (count === 1 && command !== M) return data // no arrow
            if (count === 2 && useStartArrow) copy(second, command === L ? now : last)

            if (i === len) {

                if (useStartArrow) {
                    data.push(...getArrowPath(ui, startArrow, second, first, strokeWidth, connectPoint))

                    if (connectPoint.x) {
                        getDistancePoint(first, second, -connectPoint.x, true)
                        data[1] = second.x
                        data[2] = second.y
                    }
                }

                if (endArrow && endArrow !== 'none') {
                    data.push(...getArrowPath(ui, endArrow, last, now, strokeWidth, connectPoint))

                    if (connectPoint.x) {
                        getDistancePoint(now, last, -connectPoint.x, true)
                        switch (command) {
                            case L:  //lineto(x, y)
                                setPoint(data, last, i - 3 + 1)
                                break
                            case C:  //bezierCurveTo(x1, y1, x2, y2, x, y)
                                setPoint(data, last, i - 7 + 5)
                                break
                            case Q:  //quadraticCurveTo(x1, y1, x, y)
                                setPoint(data, last, i - 5 + 3)
                                break
                            case U: // arcTo(x1, y1, x2, y2, radius)
                                setPoint(data, last, i - 6 + 3)
                                break
                        }
                    }
                }

            } else {
                copy(last, now)
            }
        }

        return data
    }
}


function copyPoints(data: IPathCommandData, from: IPointData, to: IPointData, startIndex: number): void {
    copyFrom(from, data[startIndex], data[startIndex + 1])
    copyFrom(to, data[startIndex + 2], data[startIndex + 3])
}

function setPoint(data: IPathCommandData, point: IPointData, startIndex: number): void {
    data[startIndex] = point.x
    data[startIndex + 1] = point.y
}