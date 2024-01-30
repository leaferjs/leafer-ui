// leaferui's partner, allow replace
import { Paint, PaintImage, PaintGradient, Effect, TextConvert, ColorConvert, Export } from '@leafer-ui/draw'

import { PaintModule } from '@leafer-ui/paint'
import { PaintImageModule } from '@leafer-ui/image'
import { PaintGradientModule } from '@leafer-ui/gradient'
import { EffectModule } from '@leafer-ui/effect'
import '@leafer-ui/mask'

import { TextConvertModule } from '@leafer-ui/text'
import { ColorConvertModule } from '@leafer-ui/color'
import { ExportModule } from '@leafer-ui/export'


Object.assign(TextConvert, TextConvertModule)
Object.assign(ColorConvert, ColorConvertModule)

Object.assign(Paint, PaintModule)
Object.assign(PaintImage, PaintImageModule)
Object.assign(PaintGradient, PaintGradientModule)

Object.assign(Effect, EffectModule)
Object.assign(Export, ExportModule)