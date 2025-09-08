import { IEffectModule, ILeafShadowEffect } from '@leafer-ui/interface'

import { shadow, getShadowSpread } from './Shadow'
import { innerShadow } from './InnerShadow'
import { blur } from './Blur'
import { backgroundBlur } from './BackgroundBlur'


export const EffectModule: IEffectModule = {
    shadow,
    innerShadow,
    blur,
    backgroundBlur,

    // @leafer-in/shadow will rewrite
    getShadowSpread,
    isTransformShadow(_shadow: ILeafShadowEffect): boolean { return undefined }
}