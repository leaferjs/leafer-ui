import { IBranch, ILeaf, IPointData } from '@leafer/interface'
import { MatrixHelper } from '@leafer-ui/draw'

import { ILine, IPolygon, IText } from '@leafer-ui/interface'

import { PathScaler } from './PathScaler'


const matrix = MatrixHelper.get()

export function scaleResize(leaf: ILeaf, scaleX: number, scaleY: number): void {
    if (leaf.pathInputed) {
        scaleResizePath(leaf, scaleX, scaleY)
    } else {
        leaf.width *= scaleX
        leaf.height *= scaleY // Text auto height
    }
}

export function scaleResizeFont(leaf: IText, scaleX: number, scaleY: number): void {
    if (scaleX !== 1) leaf.fontSize *= scaleX
    else if (scaleY !== 1) leaf.fontSize *= scaleY
}

export function scaleResizePath(leaf: ILeaf, scaleX: number, scaleY: number): void {
    PathScaler.scale(leaf.__.path, scaleX, scaleY)
    leaf.path = leaf.__.path
}

export function scaleResizePoints(leaf: ILine | IPolygon, scaleX: number, scaleY: number): void {
    const { points } = leaf.__
    typeof points[0] === 'object' ? (points as IPointData[]).forEach(point => { point.x *= scaleX, point.y *= scaleY }) : PathScaler.scalePoints(points as number[], scaleX, scaleY)
    leaf.points = points
}


export function scaleResizeGroup(group: IBranch, scaleX: number, scaleY: number): void {
    const { children } = group
    for (let i = 0; i < children.length; i++) {
        matrix.a = scaleX // must update
        matrix.d = scaleY
        children[i].transform(matrix, true)
    }
}