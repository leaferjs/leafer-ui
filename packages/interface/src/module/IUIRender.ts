import { ILeafRender, ILeaferCanvas, IRenderOptions } from '@leafer/interface'

import { IUI, IRect, IImage, IText, IFrame, IGroup } from '../IUI'

export type IUIRenderModule = IUIRender & ThisType<IUI>

export interface IUIRender extends ILeafRender {
    __drawAfterFill?(canvas: ILeaferCanvas, options: IRenderOptions): void
    __drawContent?(canvas: ILeaferCanvas, options: IRenderOptions): void
}

export type IRectRenderModule = IRectRender & ThisType<IRect>

export interface IRectRender extends IUIRender {

}

export type IImageRenderModule = IImageRender & ThisType<IImage>

export interface IImageRender extends IUIRender {

}

export type ITextRenderModule = ITextRender & ThisType<IText>

export interface ITextRender extends IUIRender {

}

export type IGroupRenderModule = IGroupRender & ThisType<IGroup>

export interface IGroupRender extends IUIRender {

}

export type IFrameRenderModule = IFrameRender & ThisType<IFrame>

export interface IFrameRender extends IGroupRender {

}

