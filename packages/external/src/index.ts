// Implemented in partner
import { IPaintModule, IPaintImageModule, IPaintGradientModule, IEffectModule, ITextConvertModule, IExportModule, IColorConvertModule, IPathArrowModule, IStateModule, ITransitionModule, ITransitionFunction, IFilterModule } from "@leafer-ui/interface"
import { Plugin, UnitConvertHelper } from '@leafer/core'
import { hasTransparent } from './color'


export const TextConvert = {} as ITextConvertModule

export const ColorConvert = {
    hasTransparent
} as IColorConvertModule

export const UnitConvert = UnitConvertHelper

export const PathArrow = {} as IPathArrowModule


export const Paint = {} as IPaintModule

export const PaintImage = {} as IPaintImageModule

export const PaintGradient = {} as IPaintGradientModule

export const Effect = {} as IEffectModule

export const Filter = {
    apply(): void { Plugin.need('filter') }
} as unknown as IFilterModule

export const Export = {} as IExportModule

export const State = {
    setStyleName(): void { return Plugin.need('state') },
    set(): void { return Plugin.need('state') }
} as unknown as IStateModule

const transitionList = Object.create(null) as Record<string, ITransitionFunction>

export const Transition = {
    list: transitionList,
    register(attrName: string, fn: ITransitionFunction): void {
        if (attrName === '__proto__' || attrName === 'constructor' || attrName === 'prototype') return
        Transition.list[attrName] = fn
    },
    get(attrName: string): ITransitionFunction {
        if (attrName === '__proto__' || attrName === 'constructor' || attrName === 'prototype') return
        return Transition.list[attrName]
    }
} as ITransitionModule