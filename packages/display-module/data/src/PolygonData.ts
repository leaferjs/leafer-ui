import { IPolygonData } from '@leafer-ui/interface'

import { UIData } from "./UIData"


export class PolygonData extends UIData implements IPolygonData {

    public get __usePathBox(): boolean {
        return ((this as IPolygonData).points || (this as IPolygonData).__pathInputed) as any as boolean
    }

}