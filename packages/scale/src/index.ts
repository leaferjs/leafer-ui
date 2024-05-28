export { PathScaler } from './PathScaler'
export { scaleResize, scaleResizeGroup, scaleResizePath, scaleResizePoints } from './scaler'

import { ILeaf } from '@leafer/interface'
import { Leaf, Path, Line, Polygon, Group, Box } from '@leafer-ui/draw'

import { scaleResize, scaleResizeGroup, scaleResizePath, scaleResizePoints } from './scaler'


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


Leaf.prototype.__scaleResize = function (scaleX: number, scaleY: number): void {
    scaleResize(this, scaleX, scaleY)
}

Path.prototype.__scaleResize = function (scaleX: number, scaleY: number): void {
    scaleResizePath(this, scaleX, scaleY)
}

Line.prototype.__scaleResize = function (scaleX: number, scaleY: number): void {
    if (this.pathInputed) {
        scaleResizePath(this, scaleX, scaleY)
    } else if (this.points) {
        scaleResizePoints(this, scaleX, scaleY)
    } else {
        const point = this.toPoint
        point.x *= scaleX
        point.y *= scaleY
        this.toPoint = point
    }
}

Polygon.prototype.__scaleResize = function (scaleX: number, scaleY: number): void {
    if (this.pathInputed) {
        scaleResizePath(this, scaleX, scaleY)
    } else if (this.points) {
        scaleResizePoints(this, scaleX, scaleY)
    } else {
        scaleResize(this, scaleX, scaleY)
    }
}


// group

Group.prototype.__scaleResize = function (scaleX: number, scaleY: number): void {
    scaleResizeGroup(this, scaleX, scaleY)
}

Box.prototype.__scaleResize = function (scaleX: number, scaleY: number): void {
    if (this.__.__autoSize && this.children.length) {
        scaleResizeGroup(this, scaleX, scaleY)
    } else {
        scaleResize(this, scaleX, scaleY)
    }
}