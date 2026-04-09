import { INumber } from '@leafer/interface'
import { OneRadian, PathCommandDataHelper, dataProcessor, pathType, registerUI } from '@leafer/core'

import { IStar, IStarData, IStarInputData } from '@leafer-ui/interface'
import { StarData } from '@leafer-ui/data'

import { UI } from './UI'


const { sin, cos, PI } = Math
const { moveTo, lineTo, closePath } = PathCommandDataHelper


@registerUI()
export class Star<TInputData = IStarInputData> extends UI<TInputData> implements IStar {

    public get __tag() { return 'Star' }

    @dataProcessor(StarData)
    declare public __: IStarData

    @pathType(5)
    public corners?: INumber

    @pathType(0.382)
    public innerRadius?: INumber

    @pathType(0)
    public startAngle?: INumber

    public __updatePath() {

        const { width, height, corners, innerRadius, startAngle } = this.__
        const rx = width / 2, ry = height / 2

        const path: number[] = this.__.path = []

        let startRadian = 0, radian: number

        if (startAngle) {
            startRadian = startAngle * OneRadian
            moveTo(path, rx + rx * sin(startRadian), ry - ry * cos(startRadian))
        } else moveTo(path, rx, 0)

        for (let i = 1; i < corners * 2; i++) {
            radian = (i * PI) / corners + startRadian
            lineTo(path, rx + (i % 2 === 0 ? rx : rx * innerRadius) * sin(radian), ry - (i % 2 === 0 ? ry : ry * innerRadius) * cos(radian))
        }

        closePath(path)

    }

}