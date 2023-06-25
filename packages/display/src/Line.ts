import { IPointData, ITwoPointBoundsData, __Number } from '@leafer/interface'
import { PathCommandDataHelper, PointHelper, TwoPointBoundsHelper, boundsType, affectStrokeBoundsType, dataProcessor, registerUI } from '@leafer/core'

import { ILine, ILineData, ILineInputData, IStrokeAlign } from '@leafer-ui/interface'
import { LineData } from '@leafer-ui/data'

import { UI } from './UI'


const { moveTo, lineTo } = PathCommandDataHelper
const { rotate, getAngle, getDistance, defaultPoint } = PointHelper
const { setPoint, addPoint, toBounds } = TwoPointBoundsHelper

const pointBounds = {} as ITwoPointBoundsData


@registerUI()
export class Line extends UI implements ILine {

    public get __tag() { return 'Line' }

    @dataProcessor(LineData)
    public __: ILineData

    @boundsType()
    public rotation: __Number

    @affectStrokeBoundsType('center')
    public strokeAlign: IStrokeAlign

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
        moveTo(path, 0, 0)

        const to = this.toPoint
        lineTo(path, to.x, to.y)
    }

    public __updateBoxBounds(): void {
        setPoint(pointBounds, 0, 0)
        addPoint(pointBounds, this.__toPoint.x, this.__toPoint.y)
        toBounds(pointBounds, this.__layout.boxBounds)
    }

}