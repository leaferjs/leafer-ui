import { IObject } from '@leafer/interface'

import { IUIInputData } from '../IUI'


export type IMultiKeyframe = IKeyframeId | IKeyframeId[] | IKeyframe | IKeyframe[]

export type IKeyframe = IUIInputData | IAnimateKeyframe

export type IKeyframeId = number

export type IAnimateEasing =
    | 'linear'
    | 'ease'
    | 'ease-in' | 'ease-out' | 'ease-in-out'
    | 'ease-in-sine' | 'ease-out-sine' | 'ease-in-out-sine'
    | 'ease-in-quad' | 'ease-out-quad' | 'ease-in-out-quad'
    | 'ease-in-cubic' | 'ease-out-cubic' | 'ease-in-out-cubic'
    | 'ease-in-quart' | 'ease-out-quart' | 'ease-in-out-quart'
    | 'ease-in-quint' | 'ease-out-quint' | 'ease-in-out-quint'
    | 'ease-in-expo' | 'ease-out-expo' | 'ease-in-out-expo'
    | 'ease-in-circ' | 'ease-out-circ' | 'ease-in-out-circ'
    | 'ease-in-back' | 'ease-out-back' | 'ease-in-out-back'
    | 'ease-in-elastic' | 'ease-out-elastic' | 'ease-in-out-elastic'
    | 'ease-in-bounce' | 'ease-out-bounce' | 'ease-in-out-bounce'
    | number[] // cubic-bezier(number, number, number, number)

export type IAnimateDirection = 'normal' | 'alternate' | 'reverse' | 'alternate-reverse'
export type IAnimateEnding = 'normal' | 'from' | 'to'

export interface IAnimateKeyframe {
    key: IUIInputData
    easing?: IAnimateEasing
    delay?: number
    duration?: number
    endDelay?: number

    autoDelay?: number
    autoDuration?: number
    autoEndDelay?: number
}


export interface IAnimation extends IAnimateOptions {
    keys: IMultiKeyframe
}

export interface IAnimateOptions {
    easing?: IAnimateEasing
    direction?: IAnimateDirection
    delay?: number
    duration?: number
    endDelay?: number
    ending?: IAnimateEnding
    loop?: boolean | number
    speed?: number
    autoplay?: boolean
    event?: IAnimateEvents
}

export interface IAnimateEvents {
    play?: IAnimateEventFunction
    pause?: IAnimateEventFunction
    stop?: IAnimateEventFunction

    create?: IAnimateEventFunction
    update?: IAnimateEventFunction
    complete?: IAnimateEventFunction
}

export interface IAnimateEventFunction {
    (animate?: IAnimate): any
}

export interface IAnimate extends IAnimateOptions {
    target: IObject
    config: IAnimateOptions

    readonly runing: boolean
    readonly completed: boolean
    readonly looped: number

    play(): void
    pause(): void
    stop(): void
}

export interface IStates {
    [name: string]: IMultiKeyframe | IAnimation
}


export type IStateName = string