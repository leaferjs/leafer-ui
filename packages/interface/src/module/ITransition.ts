import { IObject } from '@leafer/interface'
import { IColor, IGradientPaint } from '../type/IType'

export interface ITransitionModule {
    list: ITransitionMap
    register(attrName: string, fn: ITransitionFunction): void
    get(attrName: string): ITransitionFunction

    setBetweenStyle(betweenStyle: IObject, fromStyle: IObject, toStyle: IObject, bothStyle: IObject, t: number, target: any, attrs?: IObject): void

    value(from: any, to: any, t: number, target?: IObject): any
    number(from: number, to: number, t: number, roundValue?: number): number
    color(from: IColor, to: IColor, t: number): string
    gradient(from: IGradientPaint, to: IGradientPaint, t: number, target: IObject): IGradientPaint
}

export interface ITransitionMap {
    [name: string]: ITransitionFunction
}

export interface ITransitionFunction {
    (from: any, to: any, t: number, target?: any): any
}