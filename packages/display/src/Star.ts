import { __Number } from '@leafer/interface'
import { PathCommandDataHelper, dataProcessor, pathType, registerUI } from '@leafer/core'

import { IStar, IStarData, IStarInputData } from '@leafer-ui/interface'
import { StarData } from '@leafer-ui/data'

import { UI } from './UI'


const { sin, cos, PI } = Math
const { moveTo, lineTo, closePath } = PathCommandDataHelper


@registerUI()
export class Star extends UI implements IStar {

    public get __tag() { return 'Star' }

    @dataProcessor(StarData)
    declare public __: IStarData

    @pathType(5)
    public corners: __Number

    @pathType(0.382)
    public innerRadius: __Number

    constructor(data?: IStarInputData) {
        super(data)
    }

    public __updatePath() {

        const { width, height, corners, innerRadius } = this.__
        const rx = width / 2, ry = height / 2

        const path: number[] = this.__.path = []
        moveTo(path, rx, 0)

        for (let i = 1; i < corners * 2; i++) {
            lineTo(path, rx + (i % 2 === 0 ? rx : rx * innerRadius) * sin((i * PI) / corners), ry - (i % 2 === 0 ? ry : ry * innerRadius) * cos((i * PI) / corners))
        }

        closePath(path)

    }

}