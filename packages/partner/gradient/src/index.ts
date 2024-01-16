import { IPaintGradientModule } from '@leafer-ui/interface'

import { linearGradient } from './linear'
import { radialGradient } from './radial'
import { conicGradient } from './conic'


export const PaintGradientModule: IPaintGradientModule = {
    linearGradient,
    radialGradient,
    conicGradient
}