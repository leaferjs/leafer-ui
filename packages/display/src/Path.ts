import { dataProcessor, affectStrokeBoundsType, registerUI } from '@leafer/core'

import { IPath, IPathData, IPathInputData, IStrokeAlign } from '@leafer-ui/interface'
import { PathData } from '@leafer-ui/data'

import { UI } from './UI'


@registerUI()
export class Path extends UI implements IPath {

    public get __tag() { return 'Path' }

    @dataProcessor(PathData)
    declare public __: IPathData

    @affectStrokeBoundsType('center')
    declare public strokeAlign?: IStrokeAlign

    constructor(data?: IPathInputData) {
        super(data)
    }

}