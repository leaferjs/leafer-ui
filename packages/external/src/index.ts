// Implemented in partner
import { IPaintModule, IPaintImageModule, IPaintGradientModule, IEffectModule, ITextConvertModule, IExportModule, IColorConvertModule, IPathArrowModule, IStateModule, IUI, IString, IBoolean, IUnitData, ITransitionModule, ITransitionFunction } from "@leafer-ui/interface"
import { needPlugin } from '@leafer/core'

export const TextConvert = {} as ITextConvertModule

export const ColorConvert = {} as IColorConvertModule

export const UnitConvert = {

    number(value: number | IUnitData, percentRefer?: number): number {
        if (typeof value === 'object') return value.type === 'percent' ? value.value * percentRefer : value.value
        return value
    }

}


export const PathArrow = {} as IPathArrowModule


export const Paint = {} as IPaintModule

export const PaintImage = {} as IPaintImageModule

export const PaintGradient = {} as IPaintGradientModule

export const Effect = {} as IEffectModule

export const Export = {} as IExportModule

export const State = {
    setStyleName(_leaf: IUI, _styleName: IString, _value: IBoolean): void { return needPlugin('state') },
    set(_leaf: IUI, _stateName: IString): void { return needPlugin('state') }
} as IStateModule

export const Transition = {
    list: {},
    register(attrName: string, fn: ITransitionFunction): void {
        Transition.list[attrName] = fn
    },
    get(attrName: string): ITransitionFunction {
        return Transition.list[attrName]
    }
} as ITransitionModule