import { IStarData } from '@leafer-ui/interface'

import { UIData } from "./UIData"


export class StarData extends UIData implements IStarData {

    public get __boxStroke(): boolean { return !(this as IStarData).__pathInputed }

}