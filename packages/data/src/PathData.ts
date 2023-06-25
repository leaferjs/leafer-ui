import { IPathCommandData } from '@leafer/interface'
import { PathConvert } from '@leafer/core'

import { IPathString } from '@leafer-ui/interface'
import { UIData } from "./UIData"


const { parse } = PathConvert

export class PathData extends UIData {

    protected _path: IPathCommandData

    protected setPath(value: IPathCommandData | IPathString) {
        if (typeof value === 'string') {
            this.__setInput('path', value)
            this._path = parse(value)
        } else {
            if (this.__input) this.__removeInput('path')
            this._path = value
        }
    }

}