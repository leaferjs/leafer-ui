import { IPathCommandData, IWindingRule } from '@leafer/interface'
import { PathBounds, dataProcessor, pathType, affectStrokeBoundsType, registerUI } from '@leafer/core'

import { IPath, IPathData, IPathInputData, IPathString, IStrokeAlign } from '@leafer-ui/interface'
import { PathData } from '@leafer-ui/data'

import { UI } from './UI'


const { toBounds } = PathBounds

@registerUI()
export class Path extends UI implements IPath {

    public get __tag() { return 'Path' }

    @dataProcessor(PathData)
    public __: IPathData

    @pathType()
    public path: IPathCommandData | IPathString

    @pathType()
    public windingRule: IWindingRule

    @affectStrokeBoundsType('center')
    public strokeAlign: IStrokeAlign

    constructor(data?: IPathInputData) {
        super(data)
    }

    public __updateBoxBounds(): void {
        toBounds(this.__.path, this.__layout.boxBounds)
    }

}