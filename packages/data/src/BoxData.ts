import { IBoxData } from '@leafer-ui/interface'

import { GroupData } from "./GroupData"


export class BoxData extends GroupData implements IBoxData {
    get __boxStroke(): boolean { return true }
}
