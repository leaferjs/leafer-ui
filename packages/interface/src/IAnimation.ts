import { IEventer, IEventParamsMap, IObject, IPercentData, ITransition, IAnimateEasing, IAnimateEasingFunction, IAnimateEnding, IAnimateOptions } from '@leafer/interface'

import { IUIInputData, IUI } from './IUI'


export type IAnimation = IStyleAnimation | IKeyframesAnimation

export type IAnimateType = 'all' | 'animation' | 'transition' | 'animate'

export interface IStyleAnimation extends IAnimateOptions {
    style: IUIInputData
}

export interface IKeyframesAnimation extends IAnimateOptions {
    keyframes: IKeyframe[]
}


export type IKeyframe = IUIInputData | IAnimateKeyframe

export type IKeyframeId = number

export interface IAnimateKeyframe {
    style: IUIInputData

    easing?: IAnimateEasing
    delay?: number
    duration?: number

    swing?: number
    loop?: number

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

    swing?: number
    loop?: number

    autoDelay?: number
    autoDuration?: number

    totalTime?: number // 存在delay 时， 才会有这个属性
}


export interface IAnimate extends IAnimateOptions, IEventer {
    target: IUI | IObject
    parent?: IAnimateList

    keyframes: IKeyframe[]
    config?: IAnimateOptions
    event?: IEventParamsMap

    readonly frames: IComputedKeyframe[]

    readonly style: IUIInputData
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

    init(target: IUI | IObject, keyframe: IUIInputData | IKeyframe[], options?: ITransition, isTemp?: boolean): void

    play(): void
    pause(): void
    stop(): void
    seek(time: number | IPercentData, includeDelay?: boolean): void
    kill(complete?: boolean, killStyle?: IUIInputData): void

    destroy(complete?: boolean): void
}

export interface IAnimateList extends IAnimate {
    list: IAnimate[]
    updateList(animation?: IAnimation[] | IAnimate[], isTemp?: boolean): void
    onChildEvent(type: string, _animate: IAnimate): void
}