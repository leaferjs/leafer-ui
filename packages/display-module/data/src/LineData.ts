import { ILineData } from "@leafer-ui/interface"

import { UIData } from "./UIData"


export class LineData extends UIData implements ILineData {

    public get __usePathBox(): boolean {
        return ((this as ILineData).points || (this as ILineData).__pathInputed) as any as boolean
    }

}
