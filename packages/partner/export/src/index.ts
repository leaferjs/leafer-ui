import { ILeaf, IExportFileType, IFunction, IRenderOptions, IBoundsData } from '@leafer/interface'
import { Creator, Matrix, TaskProcessor, FileHelper } from '@leafer/core'

import { IExportModule, IExportOptions, IExportResult, IExportResultFunction } from '@leafer-ui/interface'


export const ExportModule: IExportModule = {

    export(leaf: ILeaf, filename: IExportFileType | string, options?: IExportOptions | number | boolean): Promise<IExportResult> {

        this.running = true
        return addTask((success: IExportResultFunction) =>

            new Promise((resolve: IFunction) => {

                const over = (result: IExportResult) => {
                    success(result)
                    resolve()
                    this.running = false
                }

                const { leafer } = leaf
                if (leafer) {

                    leafer.waitViewCompleted(async () => {

                        let renderBounds: IBoundsData, matrix = new Matrix(), scaleX = 1, scaleY = 1
                        const { pixelRatio, slice, fill, screenshot } = FileHelper.getExportOptions(options)

                        if (screenshot) {
                            renderBounds = screenshot === true ? (leaf.isLeafer ? leafer.canvas.bounds : leaf.worldRenderBounds) : screenshot
                        } else {
                            renderBounds = leaf.getBounds('render', 'local')

                            const { localTransform, __world: world } = leaf
                            matrix.set(world).divide(localTransform).invert()
                            scaleX = 1 / (world.scaleX / leaf.scaleX)
                            scaleY = 1 / (world.scaleY / leaf.scaleY)
                        }

                        const { x, y, width, height } = renderBounds
                        const canvas = Creator.canvas({ width, height, pixelRatio })
                        const renderOptions: IRenderOptions = { matrix: matrix.translate(-x, -y).toWorld(scaleX, scaleY) }

                        if (slice) {
                            leaf = leafer // render all in bounds
                            renderOptions.bounds = canvas.bounds
                        }

                        if (!FileHelper.isOpacityImage(filename) || fill) canvas.fillWorld(canvas.bounds, fill || '#FFFFFF')
                        leaf.__render(canvas, renderOptions)

                        const data = filename === 'canvas' ? canvas : await canvas.export(filename, options)
                        over({ data })

                    })

                } else {

                    over({ data: false })

                }

            })

        )

    }

}


let tasker: TaskProcessor

function addTask(task: IFunction): Promise<IExportResult> {
    if (!tasker) tasker = new TaskProcessor()

    return new Promise((resolve: IExportResultFunction) => {
        tasker.add(async () => await task(resolve), { parallel: false })
    })
}