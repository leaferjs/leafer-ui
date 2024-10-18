import { INumber, IPointData } from '@leafer/interface'
import { PathCommandDataHelper, dataProcessor, pathType, registerUI, rewrite, rewriteAble } from '@leafer/core'

import { IPolygon, IPolygonData, IPolygonInputData } from '@leafer-ui/interface'
import { PolygonData } from '@leafer-ui/data'

import { UI } from './UI'
import { Line } from './Line'


const { sin, cos, PI } = Math
const { moveTo, lineTo, closePath, drawPoints } = PathCommandDataHelper
const line = Line.prototype

@rewriteAble()
@registerUI()
export class Polygon extends UI implements IPolygon {

    public get __tag() { return 'Polygon' }

    @dataProcessor(PolygonData)
    declare public __: IPolygonData

    @pathType(3)
    public sides?: INumber

    @pathType()
    public points?: number[] | IPointData[]

    @pathType(0)
    public curve?: boolean | number

    constructor(data?: IPolygonInputData) {
        super(data)
    }

    public __updatePath(): void {

        const path: number[] = this.__.path = []

        if (this.__.points) {

            drawPoints(path, this.__.points, false, true)

        } else {

            const { width, height, sides } = this.__
            const rx = width / 2, ry = height / 2

            moveTo(path, rx, 0)

            for (let i = 1; i < sides; i++) {
                lineTo(path, rx + rx * sin((i * 2 * PI) / sides), ry - ry * cos((i * 2 * PI) / sides))
            }

        }

        closePath(path)
    }

    @rewrite(line.__updateRenderPath)
    public __updateRenderPath(): void { }

    @rewrite(line.__updateBoxBounds)
    public __updateBoxBounds(): void { }

}