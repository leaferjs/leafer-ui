import { IEffectModule } from '@leafer-ui/interface'

import { shadow } from './Shadow'
import { innerShadow } from './InnerShadow'
import { blur } from './Blur'
import { backgroundBlur } from './BackgroundBlur'


export const EffectModule: IEffectModule = {
    shadow,
    innerShadow,
    blur,
    backgroundBlur
}