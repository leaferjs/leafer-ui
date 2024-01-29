export { LeaferTypeCreator } from './LeaferTypeCreator'

import { ILeaferType } from '@leafer/interface'

import { Leafer } from '@leafer-ui/draw'

import { LeaferTypeCreator } from './LeaferTypeCreator'

Leafer.prototype.initType = function (type: ILeaferType) {
    LeaferTypeCreator.run(type, this)
}