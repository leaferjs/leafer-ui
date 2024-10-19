import { IPathData } from '@leafer-ui/interface'

import { UIData } from "./UIData"


export class PathData extends UIData implements IPathData {
    public get __pathInputed(): number { return 2 }
}