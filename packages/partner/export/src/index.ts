export { ExportModule } from './export'

import { IExportOptions, IExportImageType, IExportFileType, IBlob } from '@leafer/interface'
import { LeaferCanvasBase, FileHelper, Platform, Debug } from '@leafer/core'


const canvas = LeaferCanvasBase.prototype
const debug = Debug.get('@leafer-ui/export')

canvas.export = function (filename: IExportFileType | string, options?: IExportOptions | number | boolean): string | Promise<any> {
    const { quality, blob } = FileHelper.getExportOptions(options)
    if (filename.includes('.')) {
        return this.saveAs(filename, quality)
    } else if (blob) {
        return this.toBlob(filename as IExportFileType, quality)
    } else {
        return this.toDataURL(filename as IExportImageType, quality)
    }
}

canvas.toBlob = function (type?: IExportFileType, quality?: number): Promise<IBlob> {
    return new Promise((resolve) => {
        Platform.origin.canvasToBolb(this.view, type, quality).then((blob) => {
            resolve(blob)
        }).catch((e) => {
            debug.error(e)
            resolve(null)
        })
    })
}

canvas.toDataURL = function (type?: IExportImageType, quality?: number): string | Promise<string> {
    return Platform.origin.canvasToDataURL(this.view, type, quality)
}

canvas.saveAs = function (filename: string, quality?: number): Promise<boolean> {
    return new Promise((resolve) => {
        Platform.origin.canvasSaveAs(this.view, filename, quality).then(() => {
            resolve(true)
        }).catch((e) => {
            debug.error(e)
            resolve(false)
        })
    })
}