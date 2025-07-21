import { IBooleanMap, IShortcutKeyCodes, IShortcutKeys, IShortcutKeysCheck, IUIEvent } from '@leafer/interface'


const downKeyMap: IBooleanMap = {}

export const Keyboard = {

    isHoldSpaceKey(): boolean {
        return Keyboard.isHold('Space')
    },

    isHold(code: IShortcutKeyCodes): boolean {
        return downKeyMap[code]
    },

    // 是否按住快捷键，可扩展语义化快捷键组合 ctrl + F || shift + F
    isHoldKeys(shortcutKeys: IShortcutKeysCheck | IShortcutKeys, e?: IUIEvent): boolean {
        return e ? (shortcutKeys as IShortcutKeysCheck)(e) : undefined
    },

    setDownCode(code: string): void {
        if (!downKeyMap[code]) downKeyMap[code] = true
    },

    setUpCode(code: string): void {
        downKeyMap[code] = false
    }

}