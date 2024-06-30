import { IExportFileType, IFunction, IRenderOptions, IBoundsData, IBounds, ILocationType, ILeaf } from '@leafer/interface'
import { Creator, Matrix, TaskProcessor, FileHelper, Bounds, Platform } from '@leafer/core'

import { IExportModule, IExportOptions, IExportResult, IExportResultFunction, IUI } from '@leafer-ui/interface'
import { getTrimBounds } from './trim'


export const ExportModule: IExportModule = {

    export(leaf: IUI, filename: IExportFileType | string, options?: IExportOptions | number | boolean): Promise<IExportResult> {

        this.running = true

        const fileType = FileHelper.fileType(filename)
        options = FileHelper.getExportOptions(options)

        return addTask((success: IExportResultFunction) =>

            new Promise((resolve: IFunction) => {

                const over = (result: IExportResult) => {
                    success(result)
                    resolve()
                    this.running = false
                }

                const { toURL } = Platform
                const { download } = Platform.origin

                if (filename === 'json') {
                    return over({ data: leaf.toJSON(options.json) })
                } else if (fileType === 'json') {
                    download(toURL(JSON.stringify(leaf.toJSON(options.json)), 'text'), filename)
                    return over({ data: true })
                }

                if (filename === 'svg') {
                    return over({ data: leaf.toSVG() })
                } else if (fileType === 'svg') {
                    download(toURL(leaf.toSVG(), 'svg'), filename)
                    return over({ data: true })
                }


                const { leafer } = leaf
                if (leafer) {

                    checkLazy(leaf)

                    leafer.waitViewCompleted(async () => {

                        let renderBounds: IBoundsData, trimBounds: IBounds, scaleX = 1, scaleY = 1
                        const { worldTransform, isLeafer, isFrame } = leaf
                        const { slice, trim, onCanvas } = options
                        let scale = options.scale || 1
                        let pixelRatio = options.pixelRatio || 1
                        const smooth = options.smooth === undefined ? leafer.config.smooth : options.smooth
                        const contextSettings = options.contextSettings || leafer.config.contextSettings

                        if (leaf.isApp) {
                            scale *= pixelRatio // app 只能以自身的pixelRatio导出，需转移到scale上
                            pixelRatio = leaf.app.pixelRatio
                        }

                        const screenshot = options.screenshot || leaf.isApp
                        const fill = (isLeafer && screenshot) ? (options.fill === undefined ? leaf.fill : options.fill) : options.fill // leafer use 
                        const needFill = FileHelper.isOpaqueImage(filename) || fill, matrix = new Matrix()

                        if (screenshot) {
                            renderBounds = screenshot === true ? (isLeafer ? leafer.canvas.bounds : leaf.worldRenderBounds) : screenshot
                        } else {
                            let relative: ILocationType | ILeaf = options.relative || (isLeafer ? 'inner' : 'local')

                            scaleX = worldTransform.scaleX
                            scaleY = worldTransform.scaleY

                            switch (relative) {
                                case 'inner':
                                    matrix.set(worldTransform)
                                    break
                                case 'local':
                                    matrix.set(worldTransform).divide(leaf.localTransform)
                                    scaleX /= leaf.scaleX
                                    scaleY /= leaf.scaleY
                                    break
                                case 'world':
                                    scaleX = 1
                                    scaleY = 1
                                    break
                                case 'page':
                                    relative = leaf.leafer
                                default:
                                    matrix.set(worldTransform).divide(leaf.getTransform(relative))
                                    const l = relative.worldTransform
                                    scaleX /= scaleX / l.scaleX
                                    scaleY /= scaleY / l.scaleY
                            }

                            renderBounds = leaf.getBounds('render', relative)
                        }

                        const { x, y, width, height } = new Bounds(renderBounds).scale(scale)

                        let canvas = Creator.canvas({ width: Math.round(width), height: Math.round(height), pixelRatio, smooth, contextSettings })
                        const renderOptions: IRenderOptions = { matrix: matrix.scale(1 / scale).invert().translate(-x, -y).withScale(1 / scaleX * scale, 1 / scaleY * scale) }

                        if (slice) {
                            leaf = leafer // render all in bounds
                            renderOptions.bounds = canvas.bounds
                        }


                        canvas.save()

                        if (isFrame && fill !== undefined) {
                            const oldFill = leaf.get('fill')
                            leaf.fill = ''
                            leaf.__render(canvas, renderOptions)
                            leaf.fill = oldFill as string
                        } else {
                            leaf.__render(canvas, renderOptions)
                        }

                        canvas.restore()


                        if (trim) {
                            trimBounds = getTrimBounds(canvas)
                            const old = canvas, { width, height } = trimBounds
                            const config = { x: 0, y: 0, width, height, pixelRatio }

                            canvas = Creator.canvas(config)
                            canvas.copyWorld(old, trimBounds, config)
                        }

                        if (needFill) canvas.fillWorld(canvas.bounds, fill || '#FFFFFF', 'destination-over')
                        if (onCanvas) onCanvas(canvas)

                        const data = filename === 'canvas' ? canvas : await canvas.export(filename, options)
                        over({ data, width: canvas.pixelWidth, height: canvas.pixelHeight, renderBounds, trimBounds })

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


function checkLazy(leaf: IUI): void {
    if (leaf.__.__needComputePaint) leaf.__.__computePaint()
    if (leaf.isBranch) leaf.children.forEach(child => checkLazy(child))
}