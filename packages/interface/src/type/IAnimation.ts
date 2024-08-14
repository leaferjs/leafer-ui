import { IUIInputData } from '../IUI'


export type IKeyframes = IKeyframeId | IKeyframeId[] | IKeyframe | IKeyframe[]

export type IKeyframe = IUIInputData | ITimelineKeyframe

export type IKeyframeId = number

export interface ITimelineKeyframe {
    style: IUIInputData
    easing?: string
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