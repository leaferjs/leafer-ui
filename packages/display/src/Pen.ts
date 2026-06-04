import { PathCreator, dataProcessor, defineKey, registerUI, useModule } from '@leafer/core'

import { IPenData, IPenInputData, IPathInputData, IPathCommandData, IPath, IPen, IPointData } from '@leafer-ui/interface'
import { PenData } from '@leafer-ui/data'

import { Group } from './Group'
import { Path } from './Path'


@useModule(PathCreator, ['set', 'path', 'paint'])
@registerUI()
export class Pen<TInputData = IPenInputData> extends Group<TInputData> implements IPen {

    public get __tag() { return 'Pen' }

    @dataProcessor(PenData)
    declare public __: IPenData

    public pathElement: IPath
    public pathStyle: IPathInputData

    @penPathType()
    declare public path: IPathCommandData // use __path, readonly

    public __path: IPathCommandData


    public setStyle(data: IPathInputData): Pen {
        const path = this.pathElement = new Path(data)
        this.pathStyle = data
        this.__path = path.path as IPathCommandData || (path.path = [])
        this.add(path)
        return this
    }

    public paint(): void {
        const { pathElement } = this
        if (!pathElement.__layout.boxChanged) pathElement.forceUpdate('path')
    }

}

export interface Pen {

    // PathCreator rewrite

    // svg and canvas
    beginPath(): Pen
    moveTo(x: number, y: number): Pen
    lineTo(x: number, y: number): Pen
    bezierCurveTo(x1: number, y1: number, x2: number, y2: number, x: number, y: number): Pen
    quadraticCurveTo(x1: number, y1: number, x: number, y: number): Pen
    closePath(): Pen

    // canvas
    rect(x: number, y: number, width: number, height: number): Pen
    roundRect(x: number, y: number, width: number, height: number, cornerRadius: number | number[]): Pen
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation?: number, startAngle?: number, endAngle?: number, anticlockwise?: boolean): Pen
    arc(x: number, y: number, radius: number, startAngle?: number, endAngle?: number, anticlockwise?: boolean): Pen
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): Pen

    // moveTo, then draw
    drawEllipse(x: number, y: number, radiusX: number, radiusY: number, rotation?: number, startAngle?: number, endAngle?: number, anticlockwise?: boolean): Pen
    drawArc(x: number, y: number, radius: number, startAngle?: number, endAngle?: number, anticlockwise?: boolean): Pen
    drawPoints(points: number[] | IPointData[], curve?: boolean | number, close?: boolean): Pen
    clearPath(): Pen  // = beginPath()

}

function penPathType() {
    return (target: IPen, key: string) => {
        defineKey(target, key, {
            get() { return this.__path }
        })
    }
}
