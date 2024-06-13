import { IHitCanvasManager, ILeaf, IHitCanvas, ILeafList, ILeaferCanvasConfig } from '@leafer/interface'
import { CanvasManager, LeafList, Creator } from '@leafer/core'


export class HitCanvasManager extends CanvasManager implements IHitCanvasManager {

    public maxTotal = 1000 // 最多缓存多少张画布

    protected pathList: ILeafList = new LeafList()
    protected pixelList: ILeafList = new LeafList()

    public getPixelType(leaf: ILeaf, config?: ILeaferCanvasConfig): IHitCanvas {
        this.__autoClear()
        this.pixelList.add(leaf)
        return Creator.hitCanvas(config)
    }

    public getPathType(leaf: ILeaf): IHitCanvas {
        this.__autoClear()
        this.pathList.add(leaf)
        return Creator.hitCanvas()
    }

    public clearImageType(): void {
        this.__clearLeafList(this.pixelList)
    }

    public clearPathType(): void {
        this.__clearLeafList(this.pathList)
    }

    protected __clearLeafList(leafList: ILeafList): void {
        if (leafList.length) {
            leafList.forEach(leaf => {
                if (leaf.__hitCanvas) {
                    leaf.__hitCanvas.destroy()
                    leaf.__hitCanvas = null
                }
            })
            leafList.reset()
        }
    }

    protected __autoClear(): void {
        if (this.pathList.length + this.pixelList.length > this.maxTotal) this.clear()
    }

    public clear(): void {
        this.clearPathType()
        this.clearImageType()
    }

}