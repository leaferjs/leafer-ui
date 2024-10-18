import { IPointData, INumber } from '@leafer/interface'
import { PathBounds, PathCommandDataHelper, PointHelper, boundsType, pathType, affectStrokeBoundsType, dataProcessor, registerUI, getPointData } from '@leafer/core'

import { ILine, ILineData, ILineInputData, IStrokeAlign } from '@leafer-ui/interface'
import { LineData } from '@leafer-ui/data'

import { UI } from './UI'
import { PathArrow } from '@leafer-ui/external'


const { moveTo, lineTo, drawPoints } = PathCommandDataHelper
const { rotate, getAngle, getDistance, defaultPoint } = PointHelper
const { toBounds } = PathBounds


@registerUI()
export class Line extends UI implements ILine { // tip: rewrited Polygon

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


    constructor(data?: ILineInputData) {
        super(data)
    }

    public __updatePath(): void {

        const data = this.__
        const path: number[] = data.path = []

        if (data.points) {

            drawPoints(path, data.points, false, data.closed)

        } else {

            moveTo(path, 0, 0)
            lineTo(path, this.width, 0)
        }

    }

    public __updateRenderPath(): void {
        const data = this.__
        if (!this.pathInputed && data.points && data.curve) {
            drawPoints(data.__pathForRender = [], data.points, data.curve, data.closed)
            if (data.__useArrow) PathArrow.addArrows(this, false)
        } else super.__updateRenderPath()
    }

    public __updateBoxBounds(): void {
        if (this.points) {
            toBounds(this.__.__pathForRender, this.__layout.boxBounds)
        } else super.__updateBoxBounds()
    }

}