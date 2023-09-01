import { IPointData, __Number } from '@leafer/interface'
import { PathBounds, PathCommandDataHelper, PointHelper, boundsType, pathType, affectStrokeBoundsType, dataProcessor, registerUI } from '@leafer/core'

import { ILine, ILineData, ILineInputData, IStrokeAlign } from '@leafer-ui/interface'
import { LineData } from '@leafer-ui/data'

import { UI } from './UI'


const { moveTo, lineTo, points } = PathCommandDataHelper
const { rotate, getAngle, getDistance, defaultPoint } = PointHelper
const { toBounds } = PathBounds


@registerUI()
export class Line extends UI implements ILine {

    public get __tag() { return 'Line' }

    @dataProcessor(LineData)
    public __: ILineData

    @boundsType()
    public rotation: __Number

    @affectStrokeBoundsType('center')
    public strokeAlign: IStrokeAlign

    @pathType()
    points: number[]

    @pathType(0)
    curve: boolean | number

    protected __toPoint: IPointData

    public get toPoint(): IPointData {
        if (this.__toPoint && !this.__layout.boxChanged) return this.__toPoint

        const { width, rotation } = this.__
        const to: IPointData = { x: 0, y: 0 }

        if (width) to.x = width
        if (rotation) rotate(to, rotation)
        this.__toPoint = to

        return to
    }

    public set toPoint(value: IPointData) {
        this.width = getDistance(defaultPoint, value)
        this.rotation = getAngle(defaultPoint, value)
        if (this.height) this.height = 0
    }


    constructor(data?: ILineInputData) {
        super(data)
    }

    public __updatePath(): void {

        const path: number[] = this.__.path = []

        if (this.__.points) {

            points(path, this.__.points, this.__.curve)

        } else {

            const to = this.toPoint
            moveTo(path, 0, 0)
            lineTo(path, to.x, to.y)
        }

    }

    public __updateBoxBounds(): void {
        toBounds(this.__.path, this.__layout.boxBounds)
    }

}