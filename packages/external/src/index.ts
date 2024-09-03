// Implemented in partner
import { IPaintModule, IPaintImageModule, IPaintGradientModule, IEffectModule, ITextConvertModule, IExportModule, IColorConvertModule, IPathArrowModule, IStateModule, IUI, IString, IBoolean } from "@leafer-ui/interface"

export function needPlugin(name: string): any {
    console.error('need @leafer-in/' + name)
}

export const TextConvert = {} as ITextConvertModule

export const ColorConvert = {} as IColorConvertModule

export const PathArrow = {} as IPathArrowModule


export const Paint = {} as IPaintModule

export const PaintImage = {} as IPaintImageModule

export const PaintGradient = {} as IPaintGradientModule

export const Effect = {} as IEffectModule

export const Export = {} as IExportModule

export const State = {
    setStyle(_leaf: IUI, _styleName: IString, _value: IBoolean): void { return needPlugin('state') },
    setState(_leaf: IUI, _stateName: IString): void { return needPlugin('state') }
} as IStateModule