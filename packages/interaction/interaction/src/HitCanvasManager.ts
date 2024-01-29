import { IScreenSizeData, IHitCanvasManager, ILeaf, IHitCanvas, ILeafList } from '@leafer/interface'
import { CanvasManager, LeafList, Creator } from '@leafer/core'


export class HitCanvasManager extends CanvasManager implements IHitCanvasManager {

    protected pathTypeList: ILeafList = new LeafList()
    protected imageTypeList: ILeafList = new LeafList()

    public getImageType(leaf: ILeaf, size: IScreenSizeData): IHitCanvas {
        this.imageTypeList.add(leaf)
        return Creator.hitCanvas(size)
    }

    public getPathType(leaf: ILeaf): IHitCanvas {
        this.pathTypeList.add(leaf)
        return Creator.hitCanvas()
    }

    public clearImageType(): void {
        this.__clearLeafList(this.imageTypeList)
    }

    public clearPathType(): void {
        this.__clearLeafList(this.pathTypeList)
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

    public clear(): void {
        this.clearPathType()
        this.clearImageType()
    }

}