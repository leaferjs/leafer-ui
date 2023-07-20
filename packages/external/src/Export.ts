import { ILeaf, IExportFileType, IBlob } from '@leafer/interface'

import { IExportModule, IExportOptions, IExportResult } from '@leafer-ui/interface'

export const Export: IExportModule = {

    export(leaf: ILeaf, filename: IExportFileType | string, options?: IExportOptions | number | boolean): Promise<IExportResult> {

        return new Promise((resolve) => {
            const { leafer } = leaf
            if (leafer) {

                leafer.waitViewLoaded(async () => {

                    let quality, blob: boolean
                    let { canvas } = leafer
                    let { unreal } = canvas

                    if (unreal) {
                        canvas = canvas.getSameCanvas()
                        canvas.backgroundColor = leafer.config.fill
                        leafer.__render(canvas, {})
                    }

                    switch (typeof options) {
                        case 'object':
                            if (options.quality) quality = options.quality
                            if (options.blob) blob = true
                            break
                        case 'number':
                            quality = options
                            break
                        case 'boolean':
                            blob = options
                    }

                    let data: IBlob | string | boolean

                    if (filename.includes('.')) {
                        data = await canvas.saveAs(filename, quality)
                    } else if (blob) {
                        data = await canvas.toBlob(filename, quality)
                    } else {
                        data = canvas.toDataURL(filename, quality)
                    }

                    resolve({ data })

                    if (unreal) canvas.recycle()

                })

            } else {
                resolve({ data: false })
            }

        })
    }

}