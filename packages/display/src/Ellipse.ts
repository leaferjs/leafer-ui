import { INumber } from '@leafer/interface'
import { PathCommandDataHelper, Platform, dataProcessor, pathType, registerUI } from '@leafer/core'

import { IEllipse, IEllipseInputData, IEllipseData } from '@leafer-ui/interface'
import { EllipseData } from '@leafer-ui/data'

import { UI } from './UI'


const { moveTo, closePath, ellipse } = PathCommandDataHelper

@registerUI()
export class Ellipse<TInputData = IEllipseInputData> extends UI<TInputData> implements IEllipse {

    public get __tag() { return 'Ellipse' }

    @dataProcessor(EllipseData)
    declare public __: IEllipseData

    @pathType(0)
    public innerRadius?: INumber

    @pathType(0)
    public startAngle?: INumber

    @pathType(0)
    public endAngle?: INumber


    public __updatePath(): void {

        const { width, height, innerRadius, startAngle, endAngle } = this.__
        const rx = width / 2, ry = height / 2

        const path: number[] = this.__.path = []
        let open: boolean

        if (innerRadius) {

            if (startAngle || endAngle) {
                if (innerRadius < 1) ellipse(path, rx, ry, rx * innerRadius, ry * innerRadius, 0, startAngle, endAngle, false)
                else open = true // 画弧线时，不能闭合路径
                ellipse(path, rx, ry, rx, ry, 0, endAngle, startAngle, true)
            } else {
                if (innerRadius < 1) {
                    ellipse(path, rx, ry, rx * innerRadius, ry * innerRadius)
                    moveTo(path, width, ry)
                }
                ellipse(path, rx, ry, rx, ry, 0, 360, 0, true)
            }

        } else {

            if (startAngle || endAngle) {
                moveTo(path, rx, ry)
                ellipse(path, rx, ry, rx, ry, 0, startAngle, endAngle, false)
            } else {
                ellipse(path, rx, ry, rx, ry)
            }

        }

        if (!open) closePath(path)

        // fix node
        if (Platform.ellipseToCurve) this.__.path = this.getPath(true)

    }

}