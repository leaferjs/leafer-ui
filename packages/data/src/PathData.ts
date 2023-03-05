import { IPathCommandData } from '@leafer/interface'
import { PathConvert } from '@leafer/core'

import { IPathString } from '@leafer-ui/interface'
import { UIData } from "./UIData"


const { parse } = PathConvert

export class PathData extends UIData {

    protected _path: IPathCommandData

    protected setPath(value: IPathCommandData | IPathString) {
        this._path = (typeof value === 'string') ? parse(value) : value
    }

}