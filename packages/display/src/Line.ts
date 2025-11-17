import { IPointData, INumber } from '@leafer/interface'
import { PathCommandDataHelper, PointHelper, boundsType, pathType, affectStrokeBoundsType, dataProcessor, registerUI, getPointData } from '@leafer/core'

import { ILine, ILineData, ILineInputData, IStrokeAlign } from '@leafer-ui/interface'
import { LineData } from '@leafer-ui/data'

import { UI } from './UI'


const { moveTo, lineTo, drawPoints } = PathCommandDataHelper
const { rotate, getAngle, getDistance, defaultPoint } = PointHelper


@registerUI()
export class Line<TInputData = ILineInputData> extends UI<TInputData> implements ILine {

    public get __tag() { return 'Line' }

    @dataProcessor(LineData)
    declare public __: ILineData

    @affectStrokeBoundsType('center')
    declare public strokeAlign?: IStrokeAlign

    @boundsType(0)
    declare public height?: INumber

    @pathType()
    public points?: number[] | IPointData[]

    @pathType(0)
    public curve?: boolean | number

    @pathType(false)
    declare public closed?: boolean

    public get toPoint(): IPointData {
        const { width, rotation } = this.__
        const to: IPointData = getPointData()

        if (width) to.x = width
        if (rotation) rotate(to, rotation)

        return to
    }

    public set toPoint(value: IPointData) {
        this.width = getDistance(defaultPoint, value)
        this.rotation = getAngle(defaultPoint, value)
        if (this.height) this.height = 0
    }


    public __updatePath(): void {

        const data = this.__
        const path: number[] = data.path = []

        if (data.points) {

            drawPoints(path, data.points, data.curve, data.closed)

        } else {

            moveTo(path, 0, 0)
            lineTo(path, this.width, 0)
        }

    }

}