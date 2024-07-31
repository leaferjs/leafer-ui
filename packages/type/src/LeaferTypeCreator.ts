import { ILeaferBase, ILeaferTypeList, ILeaferTypeFunction } from '@leafer/interface'

import { Debug } from '@leafer/core'

import { addInteractionWindow } from './window'
import { document } from './document'
import { block } from './block'


const debug = Debug.get('LeaferTypeCreator')

export const LeaferTypeCreator = {

    list: {} as ILeaferTypeList,

    register(name: string, fn: ILeaferTypeFunction): void {
        list[name] ? debug.repeat(name) : list[name] = fn
    },

    run(name: string, leafer: ILeaferBase): void {
        const fn = list[name]
        fn && fn(leafer)
    }

}

const { list, register } = LeaferTypeCreator

register('design', addInteractionWindow)
register('document', document)
register('block', block)