import { ILeaferCanvas, ILeaferCanvasConfig, INumber, IRenderOptions, IPointData, ICanvasContext2D, ICanvasContext2DSettings, IScreenSizeData } from '@leafer/interface'
import { Creator, ImageEvent, LeaferImage, Matrix, dataProcessor, dataType, registerUI, isNumber } from '@leafer/core'

import { ICanvas, ICanvasData, ICanvasInputData, IUI } from '@leafer-ui/interface'
import { CanvasData } from '@leafer-ui/data'
import { resizeType } from '@leafer-ui/decorator'

import { Rect } from './Rect'


@registerUI()
export class Canvas<TInputData = ICanvasInputData> extends Rect<TInputData> implements ICanvas {

    public get __tag() { return 'Canvas' }

    @dataProcessor(CanvasData)
    declare public __: ICanvasData

    @resizeType(100)
    declare public width?: INumber

    @resizeType(100)
    declare public height?: INumber

    @resizeType(1)
    declare public pixelRatio?: INumber

    @resizeType(true)
    public smooth?: boolean

    @dataType(false)
    public safeResize?: boolean

    @resizeType()
    public contextSettings?: ICanvasContext2DSettings

    public canvas?: ILeaferCanvas

    public get context(): ICanvasContext2D { return this.canvas.context }

    public get ready(): boolean { return !this.url }

    public url?: string // 用于临时加载canvas的base64数据，完成后会置空

    constructor(data?: TInputData) {
        super(data)
        this.canvas = Creator.canvas(this.__ as ILeaferCanvasConfig)
        if (data && (data as ICanvasInputData).url) this.drawImage((data as ICanvasInputData).url)
    }

    public drawImage(url: string): void {
        new LeaferImage({ url }).load((image: LeaferImage) => {
            this.context.drawImage(image.view, 0, 0)
            this.url = undefined
            this.paint()
            this.emitEvent(new ImageEvent(ImageEvent.LOADED, { image }))
        })
    }

    public draw(ui: IUI, offset?: IPointData, scale?: number | IPointData, rotation?: number): void {
        const matrix = new Matrix(ui.worldTransform).invert()

        const m = new Matrix()
        if (offset) m.translate(offset.x, offset.y)
        if (scale) isNumber(scale) ? m.scale(scale) : m.scale(scale.x, scale.y)
        if (rotation) m.rotate(rotation)
        matrix.multiplyParent(m)

        ui.__render(this.canvas, { matrix: matrix.withScale() })
        this.paint()
    }

    public paint(): void {
        this.forceRender()
    }

    // in __drawAfterFill()
    public __drawContent(canvas: ILeaferCanvas, _options: IRenderOptions): void {
        const { width, height } = this.__, { view } = this.canvas
        canvas.drawImage(view, 0, 0, view.width, view.height, 0, 0, width, height)
    }

    public __updateSize(): void {
        const { canvas } = this
        if (canvas) {
            const { smooth, safeResize } = this.__
            canvas.resize(this.__ as IScreenSizeData, safeResize)
            if (canvas.smooth !== smooth) canvas.smooth = smooth
        }
    }

    public destroy(): void {
        if (this.canvas) {
            this.canvas.destroy()
            this.canvas = null
        }
        super.destroy()
    }

}