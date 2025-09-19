import { IEffectModule, ILeafShadowEffect } from '@leafer-ui/interface'

import { shadow, getShadowRenderSpread, getShadowTransform } from './Shadow'
import { innerShadow, getInnerShadowSpread } from './InnerShadow'
import { blur } from './Blur'
import { backgroundBlur } from './BackgroundBlur'


export const EffectModule: IEffectModule = {
    shadow,
    innerShadow,
    blur,
    backgroundBlur,

    // @leafer-in/shadow will rewrite
    getShadowRenderSpread,
    getShadowTransform,
    isTransformShadow(_shadow: ILeafShadowEffect): boolean { return undefined },

    getInnerShadowSpread
}