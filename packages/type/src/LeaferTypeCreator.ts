import { ILeaferBase, ILeaferTypeList, ILeaferTypeFunction } from '@leafer/interface'

import { Debug } from '@leafer/core'

import { draw } from './draw'
import { design } from './design'


const debug = Debug.get('LeaferTypeCreator')

export const LeaferTypeCreator = {

    list: {} as ILeaferTypeList,

    register(name: string, fn: ILeaferTypeFunction): void {
        if (list[name]) {
            debug.repeat(name)
        } else {
            list[name] = fn
        }
    },

    run(name: string, leafer: ILeaferBase): void {
        const fn = list[name]
        if (fn) {
            fn(leafer)
        } else {
            debug.error('no', name)
        }
    }

}

const { list, register } = LeaferTypeCreator

register('draw', draw)
register('design', design)