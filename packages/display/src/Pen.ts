import { PathCreator, dataProcessor, registerUI, useModule } from '@leafer/core'

import { IPenData, IPenInputData, IPathInputData, IPathCommandData, IPath, IPen } from '@leafer-ui/interface'
import { PenData } from '@leafer-ui/data'

import { Group } from './Group'
import { Path } from './Path'


@useModule(PathCreator, ['beginPath'])
@registerUI()
export class Pen extends Group implements IPen {

    public get __tag() { return 'Pen' }

    @dataProcessor(PenData)
    declare public __: IPenData

    public pathElement: IPath
    public pathStyle: IPathInputData
    public path: IPathCommandData

    constructor(data?: IPenInputData) {
        super(data)
    }

    public setStyle(data: IPathInputData): Pen {
        const path = this.pathElement = new Path(data)
        this.pathStyle = data
        this.path = path.path as IPathCommandData || (path.path = [])
        this.add(path)
        return this
    }

    public beginPath(): Pen {
        this.path.length = 0
        this.paint()
        return this
    }

    // svg and canvas

    public moveTo(_x: number, _y: number): Pen { return this }

    public lineTo(_x: number, _y: number): Pen { return this }

    public bezierCurveTo(_x1: number, _y1: number, _x2: number, _y2: number, _x: number, _y: number): Pen { return this }

    public quadraticCurveTo(_x1: number, _y1: number, _x: number, _y: number): Pen { return this }

    public closePath(): Pen { return this }


    // canvas

    public rect(_x: number, _y: number, _width: number, _height: number): Pen { return this }

    public roundRect(_x: number, _y: number, _width: number, _height: number, _cornerRadius: number | number[]): Pen { return this }

    public ellipse(_x: number, _y: number, _radiusX: number, _radiusY: number, _rotation?: number, _startAngle?: number, _endAngle?: number, _anticlockwise?: boolean): Pen { return this }

    public arc(_x: number, _y: number, _radius: number, _startAngle?: number, _endAngle?: number, _anticlockwise?: boolean): Pen { return this }

    public arcTo(_x1: number, _y1: number, _x2: number, _y2: number, _radius: number): Pen { return this }


    // moveTo, then draw

    public drawEllipse(_x: number, _y: number, _radiusX: number, _radiusY: number, _rotation?: number, _startAngle?: number, _endAngle?: number, _anticlockwise?: boolean): Pen { return this }

    public drawArc(_x: number, _y: number, _radius: number, _startAngle?: number, _endAngle?: number, _anticlockwise?: boolean): Pen { return this }

    public drawPoints(_points: number[], _curve?: boolean | number, _close?: boolean): Pen { return this }


    public paint(): void {
        this.pathElement.forceUpdate('path')
    }

    public clear(): void {
        this.removeAll(true)
    }

}