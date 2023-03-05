import { __Number, IPointData, ITwoPointBoundsData } from '@leafer/interface'
import { PathCreator, PointHelper, TwoPointBoundsHelper, boundsType, dataProcessor, registerUI } from '@leafer/core'

import { ILine, ILineData, ILineInputData } from '@leafer-ui/interface'
import { LineData } from '@leafer-ui/data'

import { UI } from './UI'


const { begin, moveTo, lineTo, end } = PathCreator
const { rotate, getAngle, getDistance, defaultPoint } = PointHelper
const { setPoint, addPoint, toBounds } = TwoPointBoundsHelper

const pointBounds = {} as ITwoPointBoundsData


@registerUI()
export class Line extends UI implements ILine {

    @dataProcessor(LineData)
    public __: ILineData

    @boundsType()
    public rotation: __Number


    protected __to: IPointData

    public get toPoint(): IPointData {
        if (this.__to && !this.__layout.boxBoundsChanged) return this.__to

        const { width, height, rotation } = this.__
        const to: IPointData = { x: 0, y: 0 }

        if (width) to.x = width
        if (height) to.y = height

        if (rotation) rotate(to, rotation)
        this.__to = to

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

        begin(this.__.path = [])
        moveTo(0, 0)

        const to = this.toPoint
        lineTo(to.x, to.y)
        end()
    }

    public __updateBoxBounds(): void {
        setPoint(pointBounds, 0, 0)
        addPoint(pointBounds, this.__to.x, this.__to.y)
        toBounds(pointBounds, this.__layout.boxBounds)
    }

}