import { ILeaf, IExportFileType, IBlob, IFunction } from '@leafer/interface'
import { TaskProcessor } from '@leafer/core'

import { IExportModule, IExportOptions, IExportResult, IExportResultFunction } from '@leafer-ui/interface'


export const Export: IExportModule = {

    export(leaf: ILeaf, filename: IExportFileType | string, options?: IExportOptions | number | boolean): Promise<IExportResult> {

        return addTask((success: IExportResultFunction) =>

            new Promise((resolve: IFunction) => {

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

                        success({ data })
                        resolve()

                        if (unreal) canvas.recycle()

                    })

                } else {
                    success({ data: false })
                    resolve()
                }

            })

        )

    }

}


let tasker: TaskProcessor

function addTask(task: IFunction): Promise<IExportResult> {
    if (!tasker) tasker = new TaskProcessor()

    return new Promise((resolve: IExportResultFunction) => {
        tasker.add(async () => await task(resolve))
        if (!tasker.running) tasker.start()
    })
}