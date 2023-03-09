import { ITwoPointBoundsData, ILeaferCanvas, IPathCommandData, IWindingRule } from '@leafer/interface'
import { PathHelper, TwoPointBoundsHelper, dataProcessor, pathType, registerUI } from '@leafer/core'

import { IPath, IPathData, IPathInputData, IPathString } from '@leafer-ui/interface'
import { PathData } from '@leafer-ui/data'

import { UI } from './UI'


const { toTwoPointBounds } = PathHelper
const { toBounds } = TwoPointBoundsHelper

const pointBounds = {} as ITwoPointBoundsData


@registerUI()
export class Path extends UI implements IPath {

    @dataProcessor(PathData)
    public __: IPathData

    @pathType()
    public path: IPathCommandData | IPathString

    @pathType()
    public windingRule: IWindingRule

    constructor(data?: IPathInputData) {
        super(data)
    }

    public __drawRenderPath(canvas: ILeaferCanvas): void {
        canvas.beginPath()
        this.__drawPathByData(canvas, this.__.path)
    }

    public __updateBoxBounds(): void {
        toTwoPointBounds(this.__.path, pointBounds)
        toBounds(pointBounds, this.__layout.boxBounds)
    }

}