import { IDropEvent, ILeaf, ILeafList, IObject } from '@leafer/interface'
import { registerUIEvent } from '@leafer/core'

import { PointerEvent } from './PointerEvent'
import { DragEvent } from './DragEvent'


@registerUIEvent()
export class DropEvent extends PointerEvent implements IDropEvent {

    static DROP = 'drop'

    readonly list: ILeafList
    readonly data: IObject

    static setList(data: ILeaf | ILeaf[] | ILeafList): void {
        DragEvent.setList(data)
    }

    static setData(data: IObject): void {
        DragEvent.setData(data)
    }

}