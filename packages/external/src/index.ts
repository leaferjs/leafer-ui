export { Effect } from './Effect'
export { Paint } from './Paint'

export { Animate } from './Animate'
export { Export } from './Export'

import { Effect } from './Effect'
import { Paint } from './Paint'
import * as UIEffect from '@leafer-ui/effect'
import * as UIPaint from '@leafer-ui/paint'

Object.assign(Effect, UIEffect)
Object.assign(Paint, UIPaint)
