export { LeaferTypeCreator } from './LeaferTypeCreator'

import { ILeaferType } from '@leafer/interface'
import { Leafer } from '@leafer-ui/display'
import { LeaferTypeCreator } from './LeaferTypeCreator'

Leafer.prototype.initType = function (type: ILeaferType) {
    LeaferTypeCreator.run(type, this)
}