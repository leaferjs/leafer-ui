import { IBoxData } from '@leafer-ui/interface'

import { GroupData } from "./GroupData"


export class BoxData extends GroupData implements IBoxData {

    public get __boxStroke(): boolean { return !(this as IBoxData).__pathInputed }

    // 路径与圆角直接当溢出处理
    public get __drawAfterFill(): boolean { const t = this as IBoxData; return (t.overflow === 'hide' && (t.__clipAfterFill || t.innerShadow) && t.__leaf.children.length) as unknown as boolean }

    public get __clipAfterFill(): boolean { return this.__leaf.isOverflow || super.__clipAfterFill }

}
