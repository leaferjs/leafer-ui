// Implemented in partner
import { IPaintModule, IPaintImageModule, IPaintGradientModule, IEffectModule, ITextConvertModule, IExportModule, IColorConvertModule, IPathArrowModule, IStateModule, IUnitData, ITransitionModule, IFilterModule } from "@leafer-ui/interface"
import { Plugin } from '@leafer/core'


export const TextConvert = {} as ITextConvertModule

export const ColorConvert = {} as IColorConvertModule

export const UnitConvert = {
    number(value: number | IUnitData, percentRefer?: number): number {
        return typeof value === 'object' ? (value.type === 'percent' ? value.value * percentRefer : value.value) : value
    }
}


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

export const Transition = {} as ITransitionModule