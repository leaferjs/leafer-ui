import { __Number } from '@leafer/interface'
import { PathCommandDataHelper, dataProcessor, pathType, registerUI } from '@leafer/core'

import { IEllipse, IEllipseInputData, IEllipseData } from '@leafer-ui/interface'
import { EllipseData } from '@leafer-ui/data'

import { UI } from './UI'


const { moveTo, closePath, ellipse } = PathCommandDataHelper

@registerUI()
export class Ellipse extends UI implements IEllipse {

    public get __tag() { return 'Ellipse' }

    @dataProcessor(EllipseData)
    declare public __: IEllipseData

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

        const path: number[] = this.__.path = []

        if (innerRadius) {

            if (startAngle || endAngle) {
                if (innerRadius < 1) ellipse(path, rx, ry, rx * innerRadius, ry * innerRadius, 0, startAngle, endAngle, false)
                ellipse(path, rx, ry, rx, ry, 0, endAngle, startAngle, true)
                if (innerRadius < 1) closePath(path)
            } else {
                if (innerRadius < 1) {
                    ellipse(path, rx, ry, rx * innerRadius, ry * innerRadius)
                    moveTo(path, width, ry)
                }
                ellipse(path, rx, ry, rx, ry, 0, 0, 360, true)
            }

        } else {

            if (startAngle || endAngle) {
                moveTo(path, rx, ry)
                ellipse(path, rx, ry, rx, ry, 0, startAngle, endAngle, false)
                closePath(path)
            } else {
                ellipse(path, rx, ry, rx, ry)
            }

        }

    }

}