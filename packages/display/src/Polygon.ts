import { __Number } from '@leafer/interface'
import { PathBounds, PathCommandDataHelper, dataProcessor, pathType, registerUI } from '@leafer/core'

import { IPolygon, IPolygonData, IPolygonInputData } from '@leafer-ui/interface'
import { PolygonData } from '@leafer-ui/data'

import { UI } from './UI'


const { sin, cos, PI } = Math
const { moveTo, lineTo, closePath, drawPoints } = PathCommandDataHelper
const { toBounds } = PathBounds

@registerUI()
export class Polygon extends UI implements IPolygon {

    public get __tag() { return 'Polygon' }

    @dataProcessor(PolygonData)
    declare public __: IPolygonData

    @pathType(3)
    sides: number

    @pathType()
    points: number[]

    @pathType(0)
    curve: boolean | number

    public get resizeable(): boolean { return !this.points }

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


    public __updateRenderPath(): void {
        if (this.__.points && this.__.curve) {
            drawPoints(this.__.__pathForRender = [], this.__.points, this.__.curve, true)
        } else {
            super.__updateRenderPath()
        }
    }

    public __updateBoxBounds(): void {
        if (this.__.points) {
            toBounds(this.__.__pathForRender, this.__layout.boxBounds)
            this.__updateNaturalSize()
        } else {
            super.__updateBoxBounds()
        }
    }

}