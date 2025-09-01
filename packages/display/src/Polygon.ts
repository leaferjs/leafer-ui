import { INumber, IPointData } from '@leafer/interface'
import { PathCommandDataHelper, dataProcessor, pathType, registerUI, rewriteAble } from '@leafer/core'

import { IPolygon, IPolygonData, IPolygonInputData } from '@leafer-ui/interface'
import { PolygonData } from '@leafer-ui/data'

import { UI } from './UI'


const { sin, cos, PI } = Math
const { moveTo, lineTo, closePath, drawPoints } = PathCommandDataHelper

@rewriteAble()
@registerUI()
export class Polygon<TInputData = IPolygonInputData> extends UI<TInputData> implements IPolygon {

    public get __tag() { return 'Polygon' }

    @dataProcessor(PolygonData)
    declare public __: IPolygonData

    @pathType(3)
    public sides?: INumber

    @pathType()
    public points?: number[] | IPointData[]

    @pathType(0)
    public curve?: boolean | number


    public __updatePath(): void {

        const data = this.__
        const path: number[] = data.path = []

        if (data.points) {

            drawPoints(path, data.points, data.curve, true)

        } else {

            const { width, height, sides } = data
            const rx = width / 2, ry = height / 2

            moveTo(path, rx, 0)

            for (let i = 1; i < sides; i++) {
                lineTo(path, rx + rx * sin((i * 2 * PI) / sides), ry - ry * cos((i * 2 * PI) / sides))
            }

            closePath(path)

        }

    }

}