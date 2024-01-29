import { ICursorTypeMap, ICursorType } from '@leafer/interface'


export class Cursor {

    static custom: ICursorTypeMap = {}

    static set(name: string, value: ICursorType | ICursorType[]): void {
        this.custom[name] = value
    }

    static get(name: string): ICursorType | ICursorType[] {
        return this.custom[name]
    }

}