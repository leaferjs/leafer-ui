import { IUIInputData } from '../IUI'


export type IKeyframes = IKeyframe[] | IKeyframeId[]

export type IKeyframe = IStyleKeyframe | ITimeKeyframe

export type IKeyframeId = number

export type IStyleKeyframe = IUIInputData

export interface ITimeKeyframe {
    style: IUIInputData
    easing?: string
    delay?: number
    duration: number
    endDelay?: number
}

export interface IAnimation extends IAnimationOptions {
    keyframes: IKeyframe | IKeyframes
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

export interface IAnimationControl {

}

export interface IStates {
    [name: string]: IStyleKeyframe | IAnimation
}