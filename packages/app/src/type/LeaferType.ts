import { ILeafer, ILeaferTypeList, ILeaferTypeFunction } from '@leafer/interface'

import { Debug } from '@leafer/core'

import { user } from './user'
import { design } from './design'


const debug = Debug.get('LeaferType')

export const LeaferType = {

    list: {} as ILeaferTypeList,

    register(name: string, fn: ILeaferTypeFunction): void {
        if (list[name]) {
            debug.error('repeat:', name)
        } else {
            list[name] = fn
        }
    },

    run(name: string, leafer: ILeafer): void {
        const fn = LeaferType.list[name]
        if (fn) {
            fn(leafer)
        } else {
            debug.error('no', name)
        }
    }

}

const { list } = LeaferType

LeaferType.register('user', user)
LeaferType.register('design', design)