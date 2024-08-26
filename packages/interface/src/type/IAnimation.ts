import { IUIInputData } from '../IUI'


export type IKeyframes = IKeyframeId | IKeyframeId[] | IKeyframe | IKeyframe[]

export type IKeyframe = IUIInputData | IAnimationKeyframe

export type IKeyframeId = number

export type IAnimationEasing =
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

export type IAnimationDirection = 'normal' | 'alternate' | 'reverse' | 'alternate-reverse'
export type IAnimationEnding = 'normal' | 'from' | 'to'

export interface IAnimationKeyframe {
    key: IUIInputData
    easing?: IAnimationEasing
    delay?: number
    duration?: number
    endDelay?: number

    autoDelay?: number
    autoDuration?: number
    autoEndDelay?: number
}


export interface IAnimationData extends IAnimationOptions {
    keys: IKeyframes
}

export interface IAnimationOptions {
    easing?: IAnimationEasing
    direction?: IAnimationDirection
    delay?: number
    duration?: number
    endDelay?: number
    ending?: IAnimationEnding
    loop?: boolean | number
    speed?: number
    autoplay?: boolean
}

export interface IAnimation {
    readonly easing: IAnimationEasing
    readonly direction: IAnimationDirection
    readonly delay: number
    readonly duration: number
    readonly endDelay: number
    readonly ending: IAnimationEnding
    readonly loop: boolean | number
    readonly speed: number
    readonly autoplay?: boolean
    play(): void
    pause(): void
    finish(): void
    replay(): void
}

export interface IStates {
    [name: string]: IKeyframes | IAnimationData
}


export type IStateName = string