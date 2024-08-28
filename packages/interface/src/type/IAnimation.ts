import { IObject, IFunction } from '@leafer/interface'

import { IUIInputData } from '../IUI'


export type IMultiKeyframe = IKeyframeId | IKeyframeId[] | IKeyframe | IKeyframe[]

export type IKeyframe = IUIInputData | IAnimateKeyframe

export type IKeyframeId = number

export type IAnimateEasing =
    | IAnimateEasingName
    | number[] // cubic-bezier(number, number, number, number)

export type IAnimateEasingName =
    | 'linear'
    | 'ease'
    | 'ease-in' | 'ease-out' | 'ease-in-out'
    | 'sine-in' | 'sine-out' | 'sine-in-out'
    | 'quad-in' | 'quad-out' | 'quad-in-out'
    | 'cubic-in' | 'cubic-out' | 'cubic-in-out'
    | 'quart-in' | 'quart-out' | 'quart-in-out'
    | 'quint-in' | 'quint-out' | 'quint-in-out'
    | 'expo-in' | 'expo-out' | 'expo-in-out'
    | 'circ-in' | 'circ-out' | 'circ-in-out'
    | 'back-in' | 'back-out' | 'back-in-out'
    | 'elastic-in' | 'elastic-out' | 'elastic-in-out'
    | 'bounce-in' | 'bounce-out' | 'bounce-in-out'

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

export interface IComputedKeyframe {
    key: IUIInputData
    before: IUIInputData

    easingFn?: IFunction

    delay?: number
    endDelay?: number
    duration?: number

    autoDelay?: number
    autoDuration?: number
    autoEndDelay?: number

    totalDuration?: number // 存在delay / endDelay 时， 才会有这个属性
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

    readonly began: boolean
    readonly running: boolean
    readonly completed: boolean
    readonly destroyed: boolean

    readonly now: number
    readonly looped: number

    play(): void
    pause(): void
    stop(): void
    seek(time: number): void

    destroy(complete?: boolean): void
}

export interface IStates {
    [name: string]: IMultiKeyframe | IAnimation
}


export type IStateName = string