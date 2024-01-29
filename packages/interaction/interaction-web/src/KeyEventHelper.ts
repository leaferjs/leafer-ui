import { IKeyEvent } from '@leafer/interface'
import { InteractionHelper } from '@leafer/interaction'


export const KeyEventHelper = {

    convert(e: KeyboardEvent): IKeyEvent {
        const base = InteractionHelper.getBase(e)
        const data: IKeyEvent = {
            ...base,
            code: e.code,
            key: e.key
        }
        return data
    }

}