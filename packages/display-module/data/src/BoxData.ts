import { IBox, IBoxData } from '@leafer-ui/interface'

import { GroupData } from "./GroupData"


export class BoxData extends GroupData implements IBoxData {

    public get __boxStroke(): boolean { return !(this as IBoxData).__pathInputed }

    // 当成整体处理
    public get __drawAfterFill(): boolean { const t = this as IBoxData; return t.__single || t.__clipAfterFill }

    public get __clipAfterFill(): boolean { const t = this as IBoxData; return t.overflow !== 'show' && t.__leaf.children.length && ((t.__leaf as IBox).isOverflow || super.__clipAfterFill) as unknown as boolean }

}
