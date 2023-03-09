import { __Number } from '@leafer/interface'
import { PathCreator, dataProcessor, pathType, registerUI } from '@leafer/core'

import { IPolygon, IPolygonData, IPolygonInputData } from '@leafer-ui/interface'
import { PolygonData } from '@leafer-ui/data'

import { UI } from './UI'


const { sin, cos, PI } = Math
const { begin, moveTo, lineTo, close } = PathCreator


@registerUI()
export class Polygon extends UI implements IPolygon {

    @dataProcessor(PolygonData)
    public __: IPolygonData

    @pathType(3)
    sides: number

    constructor(data?: IPolygonInputData) {
        super(data)
    }

    public __updatePath(): void {

        const { width, height, sides } = this.__
        const rx = width / 2, ry = height / 2

        begin(this.__.path = [])
        moveTo(rx, 0)

        for (let i = 1; i < sides; i++) {
            lineTo(rx + rx * sin((i * 2 * PI) / sides), ry - ry * cos((i * 2 * PI) / sides))
        }

        close()
    }

}