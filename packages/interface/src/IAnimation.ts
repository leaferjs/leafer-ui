import { IEventer, IEventMap, IObject, IPercentData } from '@leafer/interface'

import { IUIInputData, IUI } from './IUI'


export type IAnimation = IStyleAnimation | IKeyframesAnimation

export type ITransition = IAnimateOptions | IAnimateEasingName | number | boolean

export type IAnimateType = 'all' | 'animation' | 'transition' | 'animate'

export interface IStyleAnimation extends IAnimateOptions {
    style: IUIInputData
}

export interface IKeyframesAnimation extends IAnimateOptions {
    keyframes: IKeyframe[]
}

export interface IAnimateOptions {
    easing?: IAnimateEasing

    delay?: number
    duration?: number
    ending?: IAnimateEnding

    reverse?: boolean
    swing?: boolean

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

    totalTime?: number // 存在delay 时， 才会有这个属性
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
    | IObject

export interface ICubicBezierEasing {
    name: 'cubic-bezier',
    value: [number, number, number, number]
}

export interface IStepsEasing {
    name: 'steps',
    value: number | [number, 'floor' | 'round' | 'ceil']
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


export type IAnimateEnding = 'auto' | 'from' | 'to'

export interface IAnimateEvents {
    created?: IAnimateEventFunction

    play?: IAnimateEventFunction
    pause?: IAnimateEventFunction
    stop?: IAnimateEventFunction
    seek?: IAnimateEventFunction

    update?: IAnimateEventFunction
    completed?: IAnimateEventFunction
}

export interface IAnimateEventFunction {
    (animate?: IAnimate): any
}



export interface IAnimate extends IAnimateOptions, IEventer {
    target: IUI

    keyframes: IKeyframe[]
    config?: IAnimateOptions
    event?: IEventMap

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

    readonly realEnding: IAnimateEnding

    init(target: IUI, keyframe: IUIInputData | IKeyframe[], options?: ITransition, isTemp?: boolean): void

    play(): void
    pause(): void
    stop(): void
    seek(time: number | IPercentData): void
    kill(): void

    destroy(complete?: boolean): void
}