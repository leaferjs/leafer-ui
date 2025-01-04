// leaferui's partner, allow replace
import { Paint, PaintImage, PaintGradient, Effect, TextConvert, ColorConvert } from '@leafer-ui/draw'

import { PaintModule } from '@leafer-ui/paint'
import { PaintImageModule } from '@leafer-ui/image'
import { PaintGradientModule } from '@leafer-ui/gradient'
import { EffectModule } from '@leafer-ui/effect'
import '@leafer-ui/mask'

import { TextConvertModule } from '@leafer-ui/text'
import { ColorConvertModule } from '@leafer-ui/color'


Object.assign(TextConvert, TextConvertModule)
Object.assign(ColorConvert, ColorConvertModule)

Object.assign(Paint, PaintModule)
Object.assign(PaintImage, PaintImageModule)
Object.assign(PaintGradient, PaintGradientModule)

Object.assign(Effect, EffectModule)