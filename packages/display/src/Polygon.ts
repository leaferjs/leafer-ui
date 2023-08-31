import { __Number } from '@leafer/interface'
import { PathBounds, PathCommandDataHelper, dataProcessor, pathType, registerUI } from '@leafer/core'

import { IPolygon, IPolygonData, IPolygonInputData } from '@leafer-ui/interface'
import { PolygonData } from '@leafer-ui/data'

import { UI } from './UI'


const { sin, cos, PI } = Math
const { moveTo, lineTo, closePath, points } = PathCommandDataHelper
const { toBounds } = PathBounds

@registerUI()
export class Polygon extends UI implements IPolygon {

    public get __tag() { return 'Polygon' }

    @dataProcessor(PolygonData)
    public __: IPolygonData

    @pathType(3)
    sides: number

    @pathType()
    points: number[]

    @pathType()
    curve: number

    constructor(data?: IPolygonInputData) {
        super(data)
    }

    public __updatePath(): void {

        const path: number[] = this.__.path = []

        if (this.__.points) {

            points(path, this.__.points, this.__.curve)

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

    public __updateBoxBounds(): void {
        this.__.points ? toBounds(this.__.path, this.__layout.boxBounds) : super.__updateBoxBounds()
    }

}