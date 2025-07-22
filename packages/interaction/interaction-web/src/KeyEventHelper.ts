import { IKeyCodes, IKeyEvent } from '@leafer/interface'
import { InteractionHelper } from '@leafer-ui/core'


export const KeyEventHelper = {

    convert(e: KeyboardEvent): IKeyEvent {
        const base = InteractionHelper.getBase(e)
        const data: IKeyEvent = {
            ...base,
            code: e.code as IKeyCodes,
            key: e.key
        }
        return data
    }

}