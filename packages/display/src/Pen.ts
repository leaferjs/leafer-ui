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

    // svg and canvas

    public beginPath(): Pen { return this }

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

    public drawPoints(_points: number[] | IPointData[], _curve?: boolean | number, _close?: boolean): Pen { return this }

    public clearPath(): Pen { return this } // = beginPath()


    public paint(): void {
        if (!this.pathElement.__layout.boxChanged) this.pathElement.forceUpdate('path')
    }

}

function penPathType() {
    return (target: IPen, key: string) => {
        defineKey(target, key, {
            get() { return this.__path }
        })
    }
}