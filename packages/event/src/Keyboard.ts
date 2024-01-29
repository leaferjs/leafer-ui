import { IBooleanMap } from '@leafer/interface'


const downKeyMap: IBooleanMap = {}

export const Keyboard = {

    isHoldSpaceKey(): boolean {
        return Keyboard.isHold('Space')
    },

    isHold(code: string): boolean {
        return downKeyMap[code]
    },

    setDownCode(code: string): void {
        if (!downKeyMap[code]) downKeyMap[code] = true
    },

    setUpCode(code: string): void {
        downKeyMap[code] = false
    }

}