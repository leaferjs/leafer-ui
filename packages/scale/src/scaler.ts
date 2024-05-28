import { IBranch, ILeaf } from '@leafer/interface'
import { MatrixHelper } from '@leafer-ui/draw'

import { PathScaler } from './PathScaler'
import { ILine, IPolygon } from '@leafer-in/interface'


const matrix = MatrixHelper.get()

export function scaleResize(leaf: ILeaf, scaleX: number, scaleY: number): void {
    if (leaf.pathInputed) {
        scaleResizePath(leaf, scaleX, scaleY)
    } else {
        if (scaleX !== 1) leaf.width *= scaleX
        if (scaleY !== 1) leaf.height *= scaleY // Text auto height
    }
}

export function scaleResizePath(leaf: ILeaf, scaleX: number, scaleY: number): void {
    PathScaler.scale(leaf.__.path, scaleX, scaleY)
    leaf.path = leaf.__.path
}

export function scaleResizePoints(leaf: ILine | IPolygon, scaleX: number, scaleY: number): void {
    PathScaler.scalePoints(leaf.__.points, scaleX, scaleY)
    leaf.points = leaf.__.points
}


export function scaleResizeGroup(group: IBranch, scaleX: number, scaleY: number): void {
    const { children } = group
    for (let i = 0; i < children.length; i++) {
        matrix.a = scaleX // must update
        matrix.d = scaleY
        children[i].transform(matrix, true)
    }
}