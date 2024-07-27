import { IExportFileType, IFunction, IRenderOptions, IBoundsData, IBounds, ILocationType, ILeaf } from '@leafer/interface'
import { Creator, Matrix, TaskProcessor, FileHelper, Bounds, Platform, MathHelper } from '@leafer/core'

import { IExportModule, IExportOptions, IExportResult, IExportResultFunction, IUI } from '@leafer-ui/interface'
import { getTrimBounds } from './trim'


export const ExportModule: IExportModule = {

    export(leaf: IUI, filename: IExportFileType | string, options?: IExportOptions | number | boolean): Promise<IExportResult> {

        this.running = true

        const fileType = FileHelper.fileType(filename)
        const isDownload = filename.includes('.')
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


                if (fileType === 'json') {
                    isDownload && download(toURL(JSON.stringify(leaf.toJSON(options.json)), 'text'), filename)
                    return over({ data: isDownload ? true : leaf.toJSON(options.json) })
                }

                if (fileType === 'svg') {
                    isDownload && download(toURL(leaf.toSVG(), 'svg'), filename)
                    return over({ data: isDownload ? true : leaf.toSVG() })
                }


                const { leafer } = leaf
                if (leafer) {

                    checkLazy(leaf)

                    leafer.waitViewCompleted(async () => {

                        let renderBounds: IBoundsData, trimBounds: IBounds, scaleX = 1, scaleY = 1
                        const { worldTransform, isLeafer, isFrame } = leaf
                        const { slice, trim, onCanvas } = options
                        const smooth = options.smooth === undefined ? leafer.config.smooth : options.smooth
                        const contextSettings = options.contextSettings || leafer.config.contextSettings

                        const screenshot = options.screenshot || leaf.isApp
                        const fill = (isLeafer && screenshot) ? (options.fill === undefined ? leaf.fill : options.fill) : options.fill // leafer use 
                        const needFill = FileHelper.isOpaqueImage(filename) || fill, matrix = new Matrix()

                        // 获取元素大小
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


                        // 缩放元素
                        const scaleData = { scaleX: 1, scaleY: 1 }
                        MathHelper.getScaleData(options.scale, options.size, renderBounds, scaleData)

                        let pixelRatio = options.pixelRatio || 1
                        if (leaf.isApp) {
                            scaleData.scaleX *= pixelRatio // app 只能以自身的pixelRatio导出，需转移到scale上
                            scaleData.scaleY *= pixelRatio
                            pixelRatio = leaf.app.pixelRatio
                        }


                        // 导出元素
                        const { x, y, width, height } = new Bounds(renderBounds).scale(scaleData.scaleX, scaleData.scaleY)
                        const renderOptions: IRenderOptions = { matrix: matrix.scale(1 / scaleData.scaleX, 1 / scaleData.scaleY).invert().translate(-x, -y).withScale(1 / scaleX * scaleData.scaleX, 1 / scaleY * scaleData.scaleY) }
                        let canvas = Creator.canvas({ width: Math.round(width), height: Math.round(height), pixelRatio, smooth, contextSettings })

                        let sliceLeaf: IUI
                        if (slice) {
                            sliceLeaf = leaf
                            sliceLeaf.__worldOpacity = 0 // hide slice

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


                        if (sliceLeaf) sliceLeaf.__updateWorldOpacity() // show slice

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