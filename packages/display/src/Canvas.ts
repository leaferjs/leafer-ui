import { ILeaferCanvas, ILeaferCanvasConfig, INumber, IRenderOptions, IPointData, ICanvasContext2D, ICanvasContext2DSettings, IScreenSizeData, ISizeData } from '@leafer/interface'
import { Creator, ImageEvent, LeaferImage, Matrix, dataProcessor, registerUI } from '@leafer/core'

import { ICanvas, ICanvasData, ICanvasInputData, IUI } from '@leafer-ui/interface'
import { CanvasData } from '@leafer-ui/data'
import { resizeType } from '@leafer-ui/decorator'

import { Rect } from './Rect'


@registerUI()
export class Canvas extends Rect implements ICanvas {

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

    @resizeType()
    public contextSettings?: ICanvasContext2DSettings

    public canvas?: ILeaferCanvas

    public context?: ICanvasContext2D

    public get ready(): boolean { return !this.url }

    public url?: string // 用于临时加载canvas的base64数据，完成后会置空

    constructor(data?: ICanvasInputData) {
        super(data)
        this.canvas = Creator.canvas(this.__ as ILeaferCanvasConfig)
        this.context = this.canvas.context
        this.__.__isCanvas = this.__.__drawAfterFill = true
        if (data && data.url) this.drawImage(data.url)
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
        ui.__layout.update()

        const matrix = new Matrix(ui.__world).invert()

        const m = new Matrix()
        if (offset) m.translate(offset.x, offset.y)
        if (scale) typeof scale === 'number' ? m.scale(scale) : m.scale(scale.x, scale.y)
        if (rotation) m.rotate(rotation)
        matrix.multiplyParent(m)

        ui.__render(this.canvas, { matrix: matrix.withScale() })
        this.paint()
    }

    public paint(): void {
        this.forceRender()
    }

    public __drawAfterFill(canvas: ILeaferCanvas, _options: IRenderOptions): void {
        const origin = this.canvas.view as ISizeData
        const { width, height } = this
        if (this.__.cornerRadius || this.pathInputed) {
            canvas.save()
            canvas.clip()
            canvas.drawImage(this.canvas.view as any, 0, 0, origin.width, origin.height, 0, 0, width, height)
            canvas.restore()
        } else {
            canvas.drawImage(this.canvas.view as any, 0, 0, origin.width, origin.height, 0, 0, width, height)
        }
    }

    public __updateSize(): void {
        const { canvas } = this
        if (canvas) {
            const { smooth } = this.__
            if (canvas.smooth !== smooth) canvas.smooth = smooth
            canvas.resize(this.__ as IScreenSizeData)
        }
    }

    public destroy(): void {
        if (this.canvas) {
            this.canvas.destroy()
            this.canvas = this.context = null
        }
        super.destroy()
    }

}