export * from '@leafer/core'

export * from '@leafer/canvas-node'
export * from '@leafer/image-node'

import { ICanvasType, ICreator, IExportFileType, IExportImageType, IFunction, IObject, ISkiaCanvas, ISkiaNAPICanvas } from '@leafer/interface'
import { Platform, Creator, FileHelper, defineKey } from '@leafer/core'

import { LeaferCanvas } from '@leafer/canvas-node'
import { LeaferImage } from '@leafer/image-node'

import { writeFileSync } from 'fs'


const { mineType, fileType } = FileHelper


Object.assign(Creator, {
    canvas: (options?, manager?) => new LeaferCanvas(options, manager),
    image: (options) => new LeaferImage(options)
} as ICreator)


export function useCanvas(canvasType: ICanvasType, power: IObject): void {

    Platform.canvasType = canvasType

    if (!Platform.origin) {
        if (canvasType === 'skia') {

            const { Canvas, loadImage } = power
            Platform.origin = {
                createCanvas: (width: number, height: number, format?: string) => new Canvas(width, height, format),
                canvasToDataURL: (canvas: ISkiaCanvas, type?: IExportImageType, quality?: number) => canvas.toDataURLSync(type, { quality }),
                canvasToBolb: (canvas: ISkiaCanvas, type?: IExportFileType, quality?: number) => canvas.toBuffer(type, { quality }),
                canvasSaveAs: (canvas: ISkiaCanvas, filename: string, quality?: number) => canvas.saveAs(filename, { quality }),
                download(_url: string, _filename: string): Promise<void> { return undefined },
                loadImage(src: any) { return loadImage(Platform.image.getRealURL(src)) }
            }

            Platform.roundRectPatch = true

        } else if (canvasType === 'napi') {

            const { Canvas, loadImage } = power
            Platform.origin = {
                createCanvas: (width: number, height: number, format?: string) => new Canvas(width, height, format),
                canvasToDataURL: (canvas: ISkiaNAPICanvas, type?: IExportImageType, quality?: number) => canvas.toDataURL(mineType(type), quality),
                canvasToBolb: async (canvas: ISkiaNAPICanvas, type?: IExportFileType, quality?: number) => canvas.toBuffer(mineType(type), quality),
                canvasSaveAs: async (canvas: ISkiaNAPICanvas, filename: string, quality?: number) => writeFileSync(filename, canvas.toBuffer(mineType(fileType(filename)), quality)),
                download(_url: string, _filename: string): Promise<void> { return undefined },
                loadImage(src: any) { return loadImage(Platform.image.getRealURL(src)) }
            }

        }

        Platform.ellipseToCurve = true

        Platform.event = {
            stopDefault(_origin: IObject): void { },
            stopNow(_origin: IObject): void { },
            stop(_origin: IObject): void { }
        }

        Platform.canvas = Creator.canvas()
    }
}

Platform.name = 'node'
Platform.backgrounder = true
Platform.requestRender = function (render: IFunction): void { setTimeout(render, 16) }
defineKey(Platform, 'devicePixelRatio', { get() { return 1 } })
Platform.conicGradientSupport = true