export { PathScaler } from './PathScaler'
export { scaleResize, scaleResizeGroup, scaleResizeFont, scaleResizePath, scaleResizePoints } from './scaler'

import { Leaf, Path, Line, Text, Polygon, Group, Box, UI } from '@leafer-ui/draw'

import { scaleResize, scaleResizeFont, scaleResizeGroup, scaleResizePath, scaleResizePoints } from './scaler'


// leaf

Leaf.prototype.scaleResize = function (scaleX: number, scaleY = scaleX, noResize?: boolean): void {
    const data = this as UI
    if (noResize || (data.editConfig && data.editConfig.editSize === 'scale')) {
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

Text.prototype.__scaleResize = function (scaleX: number, scaleY: number): void {
    if (this.__.__autoSize && this.editConfig && this.editConfig.editSize === 'font-size') {
        scaleResizeFont(this, scaleX, scaleY)
    } else {
        scaleResize(this, scaleX, scaleY)
    }
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
        this.width *= scaleX
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