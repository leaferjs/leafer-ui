import { IUIInputData } from '../IUI'


export type IKeyframes = IKeyframeId | IKeyframeId[] | IKeyframe | IKeyframe[]

export type IKeyframe = IUIInputData | ITimelineKeyframe

export type IKeyframeId = number

export type IEasingType =
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

export interface ITimelineKeyframe {
    style: IUIInputData
    easing?: IEasingType
    delay?: number
    duration: number
    endDelay?: number
}

export interface IAnimationData extends IAnimationOptions {
    keyframes: IKeyframes
}

export interface IAnimationOptions {
    easing?: string
    delay?: number
    duration: number
    endDelay?: number
    loop?: boolean | number
    direction?: string
    still?: string
}

export interface IAnimation {

}

export interface IStates {
    [name: string]: IKeyframes | IAnimationData
}


export type IStateName = string