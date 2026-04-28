import { IEllipseData } from '@leafer-ui/interface'

import { UIData } from "./UIData"


export class EllipseData extends UIData implements IEllipseData {

    public get __boxStroke(): boolean { return !(this as IEllipseData).__pathInputed }

}