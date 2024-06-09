import { IPaintGradientModule } from '@leafer-ui/interface'

import { linearGradient } from './linear'
import { radialGradient, getTransform } from './radial'
import { conicGradient } from './conic'


export const PaintGradientModule: IPaintGradientModule = {
    linearGradient,
    radialGradient,
    conicGradient,
    getTransform
}