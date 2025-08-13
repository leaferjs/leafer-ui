import { IScaleFixed, IBounds } from '@leafer/interface'

import { IBoxInputData, IGroup, IBox } from './IUI'


export interface IScrollConfig {
    theme?: IScrollTheme // 主题
    style?: IBoxInputData // 滚动条样式
    size?: number // 滚动条的size
    cornerRadius?: number // 默认取size的一半
    endsMargin?: number // 滚动条两端的间距
    sideMargin?: number // 滚动条两侧的间距
    minSize?: number // 最小显示size
    scaleFixed?: IScaleFixed
    scrollType?: 'drag' | 'move' | 'both' // 滚动类型
    stopDefault?: boolean, // 阻止自身之外的默认滚动
    hideOnActionEnd?: boolean | 'hover' | 'scroll'  // 操作结束时自动隐藏
}

export type IScrollTheme = 'light' | 'dark' | (string & {})

export interface IScroller extends IGroup {
    config: IScrollConfig
    mergedConfig: IScrollConfig

    // 滚动条
    scrollXBar: IBox
    scrollYBar: IBox

    // 滚动范围
    scrollXBounds: IBounds
    scrollYBounds: IBounds

    // 滚动区域 / 内容区域
    scrollRatioX: number
    scrollRatioY: number

    // viewport 区域 / 内容区域
    ratioX: number
    ratioY: number

    dragScrolling: boolean

    updateConfig(): void
    update(check?: boolean): void
}