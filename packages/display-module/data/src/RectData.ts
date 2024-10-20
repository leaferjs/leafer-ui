import { IRectData } from "@leafer-ui/interface"

import { UIData } from "./UIData"


export class RectData extends UIData implements IRectData {
    get __boxStroke(): boolean { return !(this as IRectData).__pathInputed }
}