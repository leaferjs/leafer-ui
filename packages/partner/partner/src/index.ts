// leaferui's partner, allow replace
import { Paint, Effect, TextConvert, ColorConvert, Export } from '@leafer-ui/core'

import * as UIPaint from '@leafer-ui/paint'
import * as UIEffect from '@leafer-ui/effect'
import { TextConvert as UITextConvert } from '@leafer-ui/text'
import { ColorConvert as UIColorConvert } from '@leafer-ui/color'
import { Export as UIExport } from '@leafer-ui/export'


Object.assign(Paint, UIPaint)
Object.assign(Effect, UIEffect)
Object.assign(TextConvert, UITextConvert)
Object.assign(ColorConvert, UIColorConvert)
Object.assign(Export, UIExport)

