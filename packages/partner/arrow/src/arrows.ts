import { IPathCommandData, IPointData } from '@leafer/interface'
import { DataHelper, PointHelper } from '@leafer/core'

import { IArrowType, IPathDataArrow, IPathDataArrowMap, IUI } from '@leafer-ui/interface'

import { PathMatrixHelper } from './PathMatrixHelper'


const { layout, rotate } = PathMatrixHelper
const { getAngle } = PointHelper


const angle: IPathDataArrow = { connect: { x: -0.5 }, offset: { x: -0.71, bevelJoin: 0.36, roundJoin: 0.22 }, path: [1, -3, -3, 2, 0, 0, 2, -3, 3] } // moveTo(-3, -3).lineTo(0, 0).lineTo(-3, 3)
const angleSide: IPathDataArrow = { connect: { x: -0.5 }, offset: { x: -1.207, bevelJoin: 0.854, roundJoin: 0.707 }, path: [1, -3, -3, 2, 0, 0, 2, -1, 0] } // moveTo(-3, -3).lineTo(0, 0).lineTo(-1, 0)

const triangleLinePath = [1, -3, 0, 2, -3, -2, 2, 0, 0, 2, -3, 2, 2, -3, 0]  // moveTo(-3, 0).lineTo(-3, -2).lineTo(0, 0).lineTo(-3, 2).lineTo(-3, 0)
const triangle: IPathDataArrow = { connect: { x: -0.5 }, offset: { x: -0.9, bevelJoin: 0.624, roundJoin: 0.4 }, path: [...triangleLinePath, 1, -2.05, 1.1, 2, -2.05, -1.1] } // fill: moveTo(-2.05, 1.1).lineTo(-2.05, -1.1)

const arrowLinePath = [1, -3, 0, 2, -3.5, -1.8, 2, 0, 0, 2, -3.5, 1.8, 2, -3, 0]  // moveTo(-3, 0).lineTo(-3.5, -1.8).lineTo(0, 0).lineTo(-3.5, 1.8).lineTo(-3, 0)
const arrow: IPathDataArrow = { connect: { x: -0.5 }, offset: { x: -1.1, bevelJoin: 0.872, roundJoin: 0.6 }, path: [...arrowLinePath, 1, -2.25, 0.95, 2, -2.25, -0.95] } // fill: moveTo(-2.25, 0.95).lineTo(-2.25, -0.95)

const triangleFlip: IPathDataArrow = { offset: { x: -0.5 }, path: [...triangle.path], } // triangle rotate 180
rotate(triangleFlip.path, 180, { x: -1.5, y: 0 })

const circleLine: IPathDataArrow = { connect: { x: -1.3 }, path: [1, 1.8, 0, 26, 0, 0, 1.8, 0, 360, 0], }  //drawArc(0, 0, 2, 0, 360)
const circle: IPathDataArrow = { connect: { x: 0.1 }, path: [...circleLine.path, 1, 0, 0, 26, 0, 0, 1, 0, 360, 0] } // fill: moveTo(0,0).arc(0, 0, 1, 0, 360)

const squareLine: IPathDataArrow = { connect: { x: -1.3 }, path: [1, -1.4, 0, 2, -1.4, -1.4, 2, 1.4, -1.4, 2, 1.4, 1.4, 2, -1.4, 1.4, 2, -1.4, 0] } // moveTo(-1.4, 0).lineTo(-1.4, -1.4).lineTo(1.4, -1.4).lineTo(1.4, 1.4).lineTo(-1.4, 1.4).lineTo(-1.4, 0)
const square: IPathDataArrow = { path: [...squareLine.path, 2, -1.4, -0.49, 2, 1, -0.49, 1, -1.4, 0.49, 2, 1, 0.49] } // fill: moveTo(-1.4, -0.49).lineTo(1, -0.49).moveTo(-1.4, 0.49).lineTo(1, 0.49)

const diamondLine = DataHelper.clone(squareLine) as IPathDataArrow // square-line rotate 45
const diamond: IPathDataArrow = DataHelper.clone(square) as IPathDataArrow // square rotate 45
rotate(diamondLine.path, 45)
rotate(diamond.path, 45)

const mark: IPathDataArrow = { offset: { x: -0.5 }, path: [1, 0, -2, 2, 0, 2] } // moveTo(0, -2).lineTo(0, 2)

export const arrows: IPathDataArrowMap = {
    angle,
    'angle-side': angleSide,

    arrow,
    triangle,
    'triangle-flip': triangleFlip,

    circle,
    'circle-line': circleLine,

    square,
    'square-line': squareLine,

    diamond,
    'diamond-line': diamondLine,

    mark,

}

export function getArrowPath(ui: IUI, arrow: IArrowType, from: IPointData, to: IPointData, scale: number, connectOffset: IPointData): IPathCommandData {
    const { strokeCap, strokeJoin } = ui.__
    const { offset, connect, path } = getArrow(arrow)

    let connectX = connect ? connect.x : 0
    let offsetX = offset ? offset.x : 0

    const data = [...path]

    if (strokeCap !== 'none') connectX -= 0.5
    if (offset) {
        if (strokeJoin === 'round' && offset.roundJoin) offsetX += offset.roundJoin
        else if (strokeJoin === 'bevel' && offset.bevelJoin) offsetX += offset.bevelJoin
    }

    if (offsetX) layout(data, offsetX, 0)
    layout(data, to.x, to.y, scale, scale, getAngle(from, to))

    connectOffset.x = (connectX + offsetX) * scale
    return data
}

function getArrow(arrow: IArrowType): IPathDataArrow {
    return (typeof arrow === 'object' ? arrow : arrows[arrow])
}