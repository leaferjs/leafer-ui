import { ITextCase } from '@leafer-ui/interface'

export function getTextCase(char: string, textCase: ITextCase, firstChar?: boolean): string {
    switch (textCase) {
        case 'title':
            return firstChar ? char.toUpperCase() : char
        case 'upper':
            return char.toUpperCase()
        case 'lower':
            return char.toLowerCase()
        default:
            return char
    }
}