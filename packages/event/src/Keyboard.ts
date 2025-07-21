import { IBooleanMap, IShortcutKeys } from '@leafer/interface'


const downKeyMap: IBooleanMap = {}

export const Keyboard = {

    isHoldSpaceKey(): boolean {
        return Keyboard.isHold('Space')
    },

    isHold(code: string): boolean {
        return downKeyMap[code]
    },

    // 是否按住快捷键，如 ctrl + F | shift + F
    isHoldShortcutKeys(_shortcutKeys?: IShortcutKeys): boolean {
        return undefined // 语义化的快捷键组合，需插件扩展
    },

    setDownCode(code: string): void {
        if (!downKeyMap[code]) downKeyMap[code] = true
    },

    setUpCode(code: string): void {
        downKeyMap[code] = false
    }

}