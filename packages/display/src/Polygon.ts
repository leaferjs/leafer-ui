import { __Number } from '@leafer/interface'
import { PathCommandDataHelper, dataProcessor, pathType, registerUI } from '@leafer/core'

import { IPolygon, IPolygonData, IPolygonInputData } from '@leafer-ui/interface'
import { PolygonData } from '@leafer-ui/data'

import { UI } from './UI'


const { sin, cos, PI } = Math
const { moveTo, lineTo, closePath } = PathCommandDataHelper


@registerUI()
export class Polygon extends UI implements IPolygon {

    public get __tag() { return 'Polygon' }

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

        const path: number[] = this.__.path = []
        moveTo(path, rx, 0)

        for (let i = 1; i < sides; i++) {
            lineTo(path, rx + rx * sin((i * 2 * PI) / sides), ry - ry * cos((i * 2 * PI) / sides))
        }

        closePath(path)
    }

}