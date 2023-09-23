import { IPointData, __Number } from '@leafer/interface'
import { PathBounds, PathCommandDataHelper, PointHelper, boundsType, pathType, affectStrokeBoundsType, dataProcessor, registerUI } from '@leafer/core'

import { ILine, ILineData, ILineInputData, IStrokeAlign } from '@leafer-ui/interface'
import { LineData } from '@leafer-ui/data'

import { UI } from './UI'


const { moveTo, lineTo, drawPoints } = PathCommandDataHelper
const { rotate, getAngle, getDistance, defaultPoint } = PointHelper
const { toBounds } = PathBounds


@registerUI()
export class Line extends UI implements ILine {

    public get __tag() { return 'Line' }

    @dataProcessor(LineData)
    declare public __: ILineData

    @affectStrokeBoundsType('center')
    declare public strokeAlign: IStrokeAlign

    @boundsType(0)
    declare public height: __Number

    @pathType()
    public points: number[]

    @pathType(0)
    public curve: boolean | number

    public get resizeable(): boolean { return !this.points }


    public get toPoint(): IPointData {
        const { width, rotation } = this.__
        const to: IPointData = { x: 0, y: 0 }

        if (width) to.x = width
        if (rotation) rotate(to, rotation)

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

            drawPoints(path, this.__.points, false)

        } else {

            moveTo(path, 0, 0)
            lineTo(path, this.width, 0)
        }

    }

    public __updateRenderPath(): void {
        if (this.__.points && this.__.curve) {
            drawPoints(this.__.__pathForRender = [], this.__.points, this.__.curve, false)
        } else {
            super.__updateRenderPath()
        }
    }

    public __updateBoxBounds(): void {
        if (this.points) {
            toBounds(this.__.__pathForRender, this.__layout.boxBounds)
            this.__updateNaturalSize()
        } else {
            super.__updateBoxBounds()
        }
    }

}