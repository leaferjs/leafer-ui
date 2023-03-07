export { Effect } from './Effect'
export { Paint } from './Paint'

export { Animate } from './Animate'
export { Export } from './Export'

import { Paint } from './Paint'
import * as UIPaint from '@leafer-ui/paint'

Object.assign(Paint, UIPaint)
