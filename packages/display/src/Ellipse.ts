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

        const data = this.__, { width, height, innerRadius, startAngle, endAngle, closed } = data
        const rx = width / 2, ry = height / 2

        const path: number[] = data.path = []
        let open: boolean, hasAngle: boolean, closedAngle: boolean

        if (startAngle || endAngle) hasAngle = true
        if (hasAngle) closedAngle = abs(endAngle - startAngle) === 360

        if (innerRadius) {

            const drawInnerEllipse = innerRadius < 1 || closed
            const innerRx = rx * innerRadius, innerRy = ry * innerRadius

            if (hasAngle) {

                ellipse(path, rx, ry, rx, ry, 0, startAngle, endAngle)

                if (drawInnerEllipse) {
                    if (closedAngle) {
                        closePath(path)
                        set(tempPoint, rx + innerRx, ry), set(tempCenter, rx, ry)
                        rotate(tempPoint, endAngle, tempCenter, rx, ry)
                        moveTo(path, tempPoint.x, tempPoint.y)
                    }
                    ellipse(path, rx, ry, innerRx, innerRy, 0, endAngle, startAngle, true)
                } else {
                    if (!closedAngle) open = true // 画弧线
                }

            } else {

                ellipse(path, rx, ry, rx, ry)

                if (drawInnerEllipse) {
                    closePath(path)
                    moveTo(path, rx + innerRx, ry)
                    ellipse(path, rx, ry, innerRx, innerRy, 0, 360, 0, true)
                }

            }

        } else {

            if (hasAngle) {
                if (!closedAngle) {
                    if (!closed) open = true
                    if (!open) moveTo(path, rx, ry)
                }
                ellipse(path, rx, ry, rx, ry, 0, startAngle, endAngle)
            } else {
                ellipse(path, rx, ry, rx, ry)
            }

        }

        if (!open) closePath(path)

        // fix node
        if (Platform.ellipseToCurve || data.__useArrow || data.cornerRadius) data.path = this.getPath(true)

    }

}