import { IBranch, ILeaf } from '@leafer/interface'
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
    const { width, height } = leaf.__localBoxBounds
    if (scaleX !== 1) {
        leaf.fontSize *= scaleX
        leaf.y -= height * (scaleX - scaleY) / 2
    } else if (scaleY !== 1) {
        leaf.fontSize *= scaleY
        leaf.x -= width * (scaleY - scaleX) / 2
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