import { PathCreator, dataProcessor, pathType, registerUI } from '@leafer/core'

import { IStar, IStarData, IStarInputData } from '@leafer-ui/interface'
import { StarData } from '@leafer-ui/data'

import { UI } from './UI'


const { sin, cos, PI } = Math
const { begin, moveTo, lineTo, close } = PathCreator


@registerUI()
export class Star extends UI implements IStar {

    @dataProcessor(StarData)
    public __: IStarData

    @pathType(5)
    public points: number

    @pathType(0.38)
    public innerRadius: number

    constructor(data?: IStarInputData) {
        super(data)
    }

    public __updatePath() {

        const { width, height, points, innerRadius } = this.__
        const rx = width / 2, ry = height / 2

        begin(this.__.path = [])
        moveTo(rx, 0)

        for (let i = 1; i < points * 2; i++) {
            lineTo(rx + (i % 2 === 0 ? rx : rx * innerRadius) * sin((i * PI) / points), ry - (i % 2 === 0 ? ry : ry * innerRadius) * cos((i * PI) / points))
        }

        close()

    }

}