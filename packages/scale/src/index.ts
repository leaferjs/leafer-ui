import { ILeaf } from '@leafer/interface'
import { Leaf, Path, Line, Polygon, Group, Box, MatrixHelper } from '@leafer-ui/draw'

import { PathScaler } from './PathScaler'


// leaf

Leaf.prototype.scaleResize = function (scaleX: number, scaleY = scaleX, noResize?: boolean): void {
    const data = this as ILeaf
    if (noResize) {
        data.scaleX *= scaleX
        data.scaleY *= scaleY
    } else {
        if (scaleX < 0) data.scaleX *= -1, scaleX = -scaleX
        if (scaleY < 0) data.scaleY *= -1, scaleY = -scaleY
        this.__scaleResize(scaleX, scaleY)
    }
}

function scaleResize(leaf: ILeaf, scaleX: number, scaleY: number): void {
    if (scaleX !== 1) leaf.width *= scaleX
    if (scaleY !== 1) leaf.height *= scaleY // Text auto height
}

Leaf.prototype.__scaleResize = function (scaleX: number, scaleY: number): void {
    scaleResize(this, scaleX, scaleY)
}

Path.prototype.__scaleResize = function (scaleX: number, scaleY: number): void {
    PathScaler.scale(this.__.path, scaleX, scaleY)
    this.path = this.__.path
}

Line.prototype.__scaleResize = function (scaleX: number, scaleY: number): void {
    if (this.points) {
        PathScaler.scalePoints(this.__.points, scaleX, scaleY)
        this.points = this.__.points
    } else {

        const point = this.toPoint
        point.x *= scaleX
        point.y *= scaleY
        this.toPoint = point

    }
}

Polygon.prototype.__scaleResize = function (scaleX: number, scaleY: number): void {
    if (this.points) {
        PathScaler.scalePoints(this.__.points, scaleX, scaleY)
        this.points = this.__.points
    } else {
        scaleResize(this, scaleX, scaleY)
    }
}


// group

const matrix = MatrixHelper.get()

function groupScaleResize(group: ILeaf, scaleX: number, scaleY: number): void {
    const { children } = group
    for (let i = 0; i < children.length; i++) {
        matrix.a = scaleX // must update
        matrix.d = scaleY
        children[i].transform(matrix, true)
    }
}

Group.prototype.__scaleResize = function (scaleX: number, scaleY: number): void {
    groupScaleResize(this, scaleX, scaleY)
}

Box.prototype.__scaleResize = function (scaleX: number, scaleY: number): void {
    if (this.__.__autoBounds && this.children.length) {
        groupScaleResize(this, scaleX, scaleY)
    } else {
        scaleResize(this, scaleX, scaleY)
    }
}