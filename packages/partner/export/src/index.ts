import { ILeaf, IExportFileType, IFunction, IRenderOptions, IBoundsData, IBounds } from '@leafer/interface'
import { Creator, Matrix, TaskProcessor, FileHelper } from '@leafer/core'

import { IExportModule, IExportOptions, IExportResult, IExportResultFunction } from '@leafer-ui/interface'
import { getTrimBounds } from './trim'


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

                        let localRenderBounds: IBoundsData, trimBounds: IBounds, scaleX = 1, scaleY = 1
                        const { pixelRatio, slice, trim, fill, screenshot } = FileHelper.getExportOptions(options)
                        const needFill = FileHelper.isOpaqueImage(filename) || fill, matrix = new Matrix()

                        if (screenshot) {
                            localRenderBounds = screenshot === true ? (leaf.isLeafer ? leafer.canvas.bounds : leaf.worldRenderBounds) : screenshot
                        } else {
                            localRenderBounds = leaf.getBounds('render', 'local')

                            const { localTransform, __world: world } = leaf
                            matrix.set(world).divide(localTransform).invert()
                            scaleX = 1 / (world.scaleX / leaf.scaleX)
                            scaleY = 1 / (world.scaleY / leaf.scaleY)
                        }

                        const { x, y, width, height } = localRenderBounds
                        let canvas = Creator.canvas({ width, height, pixelRatio })
                        const renderOptions: IRenderOptions = { matrix: matrix.translate(-x, -y).withScale(scaleX, scaleY) }

                        if (slice) {
                            leaf = leafer // render all in bounds
                            renderOptions.bounds = canvas.bounds
                        }

                        canvas.save()
                        leaf.__render(canvas, renderOptions)
                        canvas.restore()

                        if (trim) {
                            trimBounds = getTrimBounds(canvas)
                            const old = canvas, { width, height } = trimBounds
                            const config = { x: 0, y: 0, width, height, pixelRatio }

                            canvas = Creator.canvas(config)
                            canvas.copyWorld(old, trimBounds, config)
                        }

                        if (needFill) canvas.fillWorld(canvas.bounds, fill || '#FFFFFF', 'destination-over')

                        const data = filename === 'canvas' ? canvas : await canvas.export(filename, options)
                        over({ data, localRenderBounds, trimBounds })

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