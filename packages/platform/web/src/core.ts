export * from '@leafer/core'

export * from '@leafer/canvas-web'
export * from '@leafer/image-web'

import { ICreator, IFunction, IExportImageType, IExportFileType, IObject, ICanvasType } from '@leafer/interface'
import { Platform, Creator, FileHelper, defineKey } from '@leafer/core'

import { LeaferCanvas } from '@leafer/canvas-web'
import { LeaferImage } from '@leafer/image-web'


const { mineType, fileType } = FileHelper

Object.assign(Creator, {
    canvas: (options?, manager?) => new LeaferCanvas(options, manager),
    image: (options) => new LeaferImage(options)
} as ICreator)


export function useCanvas(_canvasType: ICanvasType, _power?: IObject): void {
    Platform.origin = {
        createCanvas(width: number, height: number): HTMLCanvasElement {
            const canvas = document.createElement('canvas')
            canvas.width = width
            canvas.height = height
            return canvas
        },
        canvasToDataURL: (canvas: HTMLCanvasElement, type?: IExportImageType, quality?: number) => {
            const imageType = mineType(type), url = canvas.toDataURL(imageType, quality)
            return imageType === 'image/bmp' ? url.replace('image/png;', 'image/bmp;') : url
        },
        canvasToBolb: (canvas: HTMLCanvasElement, type?: IExportFileType, quality?: number) => new Promise((resolve) => canvas.toBlob(resolve, mineType(type), quality)),
        canvasSaveAs: (canvas: HTMLCanvasElement, filename: string, quality?: any) => {
            const url = canvas.toDataURL(mineType(fileType(filename)), quality)
            return Platform.origin.download(url, filename)
        },
        download(url: string, filename: string): Promise<void> {
            return new Promise((resolve) => {
                let el = document.createElement('a')
                el.href = url
                el.download = filename
                document.body.appendChild(el)
                el.click()
                document.body.removeChild(el)
                resolve()
            })
        },
        loadImage(src: any): Promise<HTMLImageElement> {
            return new Promise((resolve, reject) => {
                const img = new Platform.origin.Image()
                const { crossOrigin } = Platform.image
                if (crossOrigin) {
                    img.setAttribute('crossOrigin', crossOrigin)
                    img.crossOrigin = crossOrigin
                }
                img.onload = () => { resolve(img) }
                img.onerror = (e: any) => { reject(e) }
                img.src = Platform.image.getRealURL(src)
            })
        },
        Image,
        PointerEvent,
        DragEvent
    }

    Platform.event = {
        stopDefault(origin: Event): void { origin.preventDefault() },
        stopNow(origin: Event): void { origin.stopImmediatePropagation() },
        stop(origin: Event): void { origin.stopPropagation() }
    }

    Platform.canvas = Creator.canvas()
    Platform.conicGradientSupport = !!Platform.canvas.context.createConicGradient
}

Platform.name = 'web'
Platform.isMobile = 'ontouchstart' in window
Platform.requestRender = function (render: IFunction): void { window.requestAnimationFrame(render) }
defineKey(Platform, 'devicePixelRatio', { get() { return devicePixelRatio } })


// same as worker

const { userAgent } = navigator

if (userAgent.indexOf("Firefox") > -1) {
    Platform.conicGradientRotate90 = true
    Platform.intWheelDeltaY = true
    Platform.syncDomFont = true
} else if (userAgent.indexOf("AppleWebKit") > -1) {
    Platform.fullImageShadow = true // 苹果内核渲染阴影
}

if (userAgent.indexOf('Windows') > -1) {
    Platform.os = 'Windows'
    Platform.intWheelDeltaY = true
} else if (userAgent.indexOf('Mac') > -1) {
    Platform.os = 'Mac'
} else if (userAgent.indexOf('Linux') > -1) {
    Platform.os = 'Linux'
}