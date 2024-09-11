import { IPercentData } from '@leafer/interface'

import { IUIInputData, IUI } from './IUI'


export type IAnimation = IStyleAnimation | IKeyframesAnimation

export type ITransition = IAnimateOptions | IAnimateEasingName | number | boolean


export interface IStyleAnimation extends IAnimateOptions {
    style: IUIInputData
}

export interface IKeyframesAnimation extends IAnimateOptions {
    keyframes: IKeyframe[]
}

export interface IAnimateOptions {
    easing?: IAnimateEasing
    direction?: IAnimateDirection

    delay?: number
    duration?: number
    ending?: IAnimateEnding

    loop?: boolean | number
    loopDelay?: number

    speed?: number

    join?: boolean
    autoplay?: boolean

    attrs?: string[]
    event?: IAnimateEvents
}


export type IKeyframe = IUIInputData | IAnimateKeyframe

export type IKeyframeId = number

export interface IAnimateKeyframe {
    style: IUIInputData

    easing?: IAnimateEasing
    delay?: number
    duration?: number

    autoDelay?: number
    autoDuration?: number
}

export interface IComputedKeyframe {
    style: IUIInputData
    beforeStyle: IUIInputData
    betweenStyle?: IUIInputData

    easingFn?: IAnimateEasingFunction

    delay?: number
    duration?: number

    autoDelay?: number
    autoDuration?: number

    totalDuration?: number // 存在delay 时， 才会有这个属性
}

export interface IAnimateEasingFunction {
    (t: number): number
}

export interface ICustomEasingFunction {
    (...arg: any): IAnimateEasingFunction
}


export type IAnimateEasing =
    | IAnimateEasingName
    | ICubicBezierEasing
    | IStepsEasing

export interface ICubicBezierEasing {
    name: 'cubic-bezier',
    params: [number, number, number, number]
}

export interface IStepsEasing {
    name: 'steps',
    params: number | [number, 'floor' | 'round' | 'ceil']
}


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
    target: IUI

    keyframes: IKeyframe[]
    config?: IAnimateOptions

    readonly frames: IComputedKeyframe[]

    readonly fromStyle: IUIInputData
    readonly toStyle: IUIInputData
    readonly endingStyle: IUIInputData

    readonly started: boolean
    readonly running: boolean
    readonly completed: boolean
    readonly destroyed: boolean

    readonly time: number
    readonly looped: number

    readonly alternate: boolean
    readonly realEnding: IAnimateEnding

    init(target: IUI, keyframe: IUIInputData | IKeyframe[], options?: ITransition, isTemp?: boolean): void

    play(): void
    pause(): void
    stop(): void
    seek(time: number | IPercentData): void
    kill(): void

    destroy(complete?: boolean): void
}