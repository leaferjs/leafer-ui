import { __Number } from '@leafer/interface'
import { PathCreator, OneRadian, dataProcessor, pathType, registerUI } from '@leafer/core'

import { IEllipse, IEllipseInputData, IEllipseData } from '@leafer-ui/interface'
import { EllipseData } from '@leafer-ui/data'

import { UI } from './UI'



const { PI } = Math
const { begin, moveTo, close, ellipse } = PathCreator


@registerUI()
export class Ellipse extends UI implements IEllipse {

    @dataProcessor(EllipseData)
    public __: IEllipseData

    @pathType(0)
    public innerRadius: __Number

    @pathType(0)
    public startAngle: __Number

    @pathType(0)
    public endAngle: __Number

    constructor(data?: IEllipseInputData) {
        super(data)
    }

    public __updatePath(): void {

        const { width, height, innerRadius, startAngle, endAngle } = this.__
        const rx = width / 2, ry = height / 2

        begin(this.__.path = [])

        if (innerRadius) {

            if (startAngle || endAngle) {
                ellipse(rx, ry, rx * (1 - innerRadius), ry * (1 - innerRadius), 0, startAngle * OneRadian, endAngle * OneRadian, false)
                ellipse(rx, ry, rx, ry, 0, endAngle * OneRadian, startAngle * OneRadian, true)
                close()
            } else {
                ellipse(rx, ry, rx * (1 - innerRadius), ry * (1 - innerRadius), 0, 0, 2 * PI, false)
                moveTo(width, ry)
                ellipse(rx, ry, rx, ry, 0, 0, 2 * PI, true)
            }

        } else {

            if (startAngle || endAngle) {
                moveTo(rx, ry)
                ellipse(rx, ry, rx, ry, 0, startAngle * OneRadian, endAngle * OneRadian, false)
                close()
            } else {
                ellipse(rx, ry, rx, ry, 0, 0, 2 * PI, false)
            }

        }

    }

}