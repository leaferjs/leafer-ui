export * from '@leafer/core'

export * from '@leafer/canvas-worker'
export * from '@leafer/image-worker'

import { ICreator, IFunction, IExportImageType, IExportFileType, IObject, ICanvasType } from '@leafer/interface'
import { Platform, Creator, FileHelper, defineKey } from '@leafer/core'

import { LeaferCanvas } from '@leafer/canvas-worker'
import { LeaferImage } from '@leafer/image-worker'

const { mineType } = FileHelper


Object.assign(Creator, {
    canvas: (options?, manager?) => new LeaferCanvas(options, manager),
    image: (options) => new LeaferImage(options)
} as ICreator)


export function useCanvas(_canvasType: ICanvasType, _power?: IObject): void {
    Platform.origin = {
        createCanvas: (width: number, height: number): OffscreenCanvas => new OffscreenCanvas(width, height),
        canvasToDataURL: (canvas: OffscreenCanvas, type?: IExportImageType, quality?: number) => {
            return new Promise((resolve, reject) => {
                (canvas as any).convertToBlob({ type: mineType(type), quality }).then((blob: Blob) => {
                    var reader = new FileReader()
                    reader.onload = (e) => resolve(e.target.result as string)
                    reader.onerror = (e) => reject(e)
                    reader.readAsDataURL(blob)
                }).catch((e: any) => {
                    reject(e)
                })
            })
        },
        canvasToBolb: (canvas: OffscreenCanvas, type?: IExportFileType, quality?: number) => (canvas as any).convertToBlob({ type: mineType(type), quality }),
        canvasSaveAs: (_canvas: OffscreenCanvas, _filename: string, _quality?: any) => new Promise((resolve) => resolve()),
        download(_url: string, _filename: string): Promise<void> { return undefined },
        loadImage(src: any): Promise<ImageBitmap> {
            return new Promise((resolve, reject) => {
                let req = new XMLHttpRequest()
                req.open('GET', Platform.image.getRealURL(src), true)
                req.responseType = "blob"
                req.onload = () => {
                    createImageBitmap(req.response).then(img => {
                        resolve(img)
                    }).catch(e => {
                        reject(e)
                    })
                }
                req.onerror = (e) => reject(e)
                req.send()
            })
        }
    }

    Platform.canvas = Creator.canvas()
    Platform.conicGradientSupport = !!Platform.canvas.context.createConicGradient
}

Platform.name = 'web'
Platform.isWorker = true
Platform.backgrounder = true
Platform.requestRender = function (render: IFunction): void { requestAnimationFrame(render) }
defineKey(Platform, 'devicePixelRatio', { get() { return 1 } })


// same as web

const { userAgent } = navigator

if (userAgent.indexOf("Firefox") > -1) {
    Platform.conicGradientRotate90 = true
    Platform.intWheelDeltaY = true
} else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) {
    Platform.fullImageShadow = true
}

if (userAgent.indexOf('Windows') > -1) {
    Platform.os = 'Windows'
    Platform.intWheelDeltaY = true
} else if (userAgent.indexOf('Mac') > -1) {
    Platform.os = 'Mac'
} else if (userAgent.indexOf('Linux') > -1) {
    Platform.os = 'Linux'
}