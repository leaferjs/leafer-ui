import { INumber, IPointData } from '@leafer/interface'
import { PathCommandDataHelper, Platform, dataProcessor, pathType, registerUI, PointHelper } from '@leafer/core'

import { IEllipse, IEllipseInputData, IEllipseData } from '@leafer-ui/interface'
import { EllipseData } from '@leafer-ui/data'

import { UI } from './UI'


const { moveTo, closePath, ellipse } = PathCommandDataHelper, { tempPoint, set, rotate } = PointHelper, { abs } = Math, tempCenter = {} as IPointData

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

        const data = this.__, { width, height, innerRadius, startAngle, endAngle } = data
        const rx = width / 2, ry = height / 2

        const path: number[] = data.path = []
        let close = true, hasAngle: boolean, closedAngle: boolean

        if (startAngle || endAngle) hasAngle = true
        if (hasAngle) closedAngle = abs(endAngle - startAngle) === 360

        if (innerRadius) {

            let outerStartAngle = startAngle, outerEndAngle = endAngle, outerAnticlockwise: boolean

            if (hasAngle) {
                if (innerRadius < 1) {
                    ellipse(path, rx, ry, rx * innerRadius, ry * innerRadius, 0, startAngle, endAngle)
                    if (closedAngle) {
                        set(tempPoint, width, ry)
                        set(tempCenter, rx, ry)
                        rotate(tempPoint, endAngle, tempCenter, rx, ry)
                        moveTo(path, tempPoint.x, tempPoint.y)
                    }
                    outerStartAngle = endAngle
                    outerEndAngle = startAngle
                    outerAnticlockwise = true
                } else {
                    if (!closedAngle) close = false // 画弧线
                }
            } else {
                if (innerRadius < 1) {
                    ellipse(path, rx, ry, rx * innerRadius, ry * innerRadius)
                    moveTo(path, width, ry)
                    outerStartAngle = 360
                    outerAnticlockwise = true
                } else {
                    outerEndAngle = 360
                }
            }

            ellipse(path, rx, ry, rx, ry, 0, outerStartAngle, outerEndAngle, outerAnticlockwise)

        } else {

            if (hasAngle) {
                if (!closedAngle) moveTo(path, rx, ry)
                ellipse(path, rx, ry, rx, ry, 0, startAngle, endAngle)
            } else {
                ellipse(path, rx, ry, rx, ry)
            }

        }

        if (close) closePath(path)

        // fix node
        if (Platform.ellipseToCurve || data.__useArrow || data.cornerRadius) data.path = this.getPath(true)

    }

}