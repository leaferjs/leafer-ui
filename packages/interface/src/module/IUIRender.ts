import { ILeafRender, ILeaferCanvas, IRenderOptions, } from '@leafer/interface'
import { IUI, IRect, IFrame, IGroup } from '../IUI'

export type IUIRenderModule = IUIRender & ThisType<IUI>

interface IUIRender extends ILeafRender {
    __renderShape?(canvas: ILeaferCanvas, options: IRenderOptions): void
}

export type IRectRenderModule = IRectRender & ThisType<IRect>

interface IRectRender extends IUIRender {

}

export type IGroupRenderModule = IGroupRender & ThisType<IGroup>

interface IGroupRender extends IUIRender {

}

export type IFrameRenderModule = IFrameRender & ThisType<IFrame>

interface IFrameRender extends IGroupRender {

}

