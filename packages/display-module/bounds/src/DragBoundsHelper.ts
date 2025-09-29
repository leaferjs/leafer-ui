import { IPointData, IBoundsData, IDragBoundsType, ILeaf, ISide } from '@leafer/interface'
import { Bounds, MathHelper } from '@leafer/core'


const { float } = MathHelper
const tempContent = new Bounds(), tempDragBounds = new Bounds()

export const DragBoundsHelper = {

    // 拖拽区域内移动
    limitMove(leaf: ILeaf, move: IPointData): void {
        const { dragBounds, dragBoundsType } = leaf
        if (dragBounds) D.getValidMove(leaf.__localBoxBounds, D.getDragBounds(leaf), dragBoundsType, move, true)
        D.axisMove(leaf, move)
    },

    // 拖拽区域内缩放
    limitScaleOf(leaf: ILeaf, origin: IPointData, scale: IPointData, lockRatio?: boolean): void {
        const { dragBounds, dragBoundsType } = leaf
        if (dragBounds) D.getValidScaleOf(leaf.__localBoxBounds, D.getDragBounds(leaf), dragBoundsType, leaf.getLocalPointByInner(leaf.getInnerPointByBox(origin)), scale, lockRatio, true)
    },

    // 按轴移动
    axisMove(leaf: ILeaf, move: IPointData) {
        const { draggable } = leaf
        if (draggable === 'x') move.y = 0
        if (draggable === 'y') move.x = 0
    },

    getDragBounds(leaf: ILeaf): IBoundsData {
        const { dragBounds } = leaf
        return dragBounds === 'parent' ? leaf.parent.boxBounds : dragBounds
    },

    isInnerMode(content: IBoundsData, dragBounds: IBoundsData, dragBoundsType: IDragBoundsType, sideType: ISide): boolean {
        return dragBoundsType === 'inner' || (dragBoundsType === 'auto' && content[sideType] > dragBounds[sideType])
    },

    getValidMove(content: IBoundsData, dragBounds: IBoundsData, dragBoundsType: IDragBoundsType, move: IPointData, change?: boolean): IPointData {
        const x = content.x + move.x, y = content.y + move.y, right = x + content.width, bottom = y + content.height
        const boundsRight = dragBounds.x + dragBounds.width, boundsBottom = dragBounds.y + dragBounds.height

        if (!change) move = { ...move }

        if (D.isInnerMode(content, dragBounds, dragBoundsType, 'width')) {  // inner 模式
            if (x > dragBounds.x) move.x += dragBounds.x - x
            else if (right < boundsRight) move.x += boundsRight - right
        } else { // outer 模式
            if (x < dragBounds.x) move.x += dragBounds.x - x
            else if (right > boundsRight) move.x += boundsRight - right
        }

        if (D.isInnerMode(content, dragBounds, dragBoundsType, 'height')) { // inner 模式
            if (y > dragBounds.y) move.y += dragBounds.y - y
            else if (bottom < boundsBottom) move.y += boundsBottom - bottom
        } else { // outer 模式
            if (y < dragBounds.y) move.y += dragBounds.y - y
            else if (bottom > boundsBottom) move.y += boundsBottom - bottom
        }

        // 避免出现很小为0的小数
        move.x = float(move.x)
        move.y = float(move.y)

        return move
    },

    getValidScaleOf(content: IBoundsData, dragBounds: IBoundsData, dragBoundsType: IDragBoundsType, origin: IPointData, scale: IPointData, lockRatio?: boolean, change?: boolean): IPointData {
        if (!change) scale = { ...scale }

        tempDragBounds.set(dragBounds)
        tempContent.set(content).scaleOf(origin, scale.x, scale.y).unsign()

        const { minX, minY, maxX, maxY, width, height } = tempContent
        const originLeftScale = (origin.x - content.x) / content.width, originRightScale = 1 - originLeftScale
        const originTopScale = (origin.y - content.y) / content.height, originBottomScale = 1 - originTopScale

        let fitScaleX: number, fitScaleY: number

        let minScale: number, maxScale: number, minAdd: number, maxAdd: number

        if (D.isInnerMode(content, dragBounds, dragBoundsType, 'width')) {  // inner 模式

            minAdd = float(minX - tempDragBounds.minX)
            maxAdd = float(tempDragBounds.maxX - maxX)

            minScale = originLeftScale && minAdd > 0 ? 1 + minAdd / (originLeftScale * width) : 1
            maxScale = originRightScale && maxAdd > 0 ? 1 + maxAdd / (originRightScale * width) : 1
            fitScaleX = Math.max(minScale, maxScale)

        } else { // outer 模式

            minAdd = float(tempDragBounds.minX - minX)
            maxAdd = float(maxX - tempDragBounds.maxX)

            minScale = originLeftScale && minAdd > 0 ? 1 - minAdd / (originLeftScale * width) : 1
            maxScale = originRightScale && maxAdd > 0 ? 1 - maxAdd / (originRightScale * width) : 1
            fitScaleX = Math.min(minScale, maxScale)
        }

        if (D.isInnerMode(content, dragBounds, dragBoundsType, 'height')) { // inner 模式

            minAdd = float(minY - tempDragBounds.minY)
            maxAdd = float(tempDragBounds.maxY - maxY)

            minScale = originTopScale && minAdd > 0 ? 1 + minAdd / (originTopScale * height) : 1
            maxScale = originBottomScale && maxAdd > 0 ? 1 + maxAdd / (originBottomScale * height) : 1

            fitScaleY = Math.max(minScale, maxScale)

            if (lockRatio) fitScaleX = fitScaleY = Math.max(fitScaleX, fitScaleY)

        } else { // outer 模式

            minAdd = float(tempDragBounds.minY - minY)
            maxAdd = float(maxY - tempDragBounds.maxY)

            minScale = originTopScale && minAdd > 0 ? 1 - minAdd / (originTopScale * height) : 1
            maxScale = originBottomScale && maxAdd > 0 ? 1 - maxAdd / (originBottomScale * height) : 1
            fitScaleY = Math.min(minScale, maxScale)
        }

        scale.x *= fitScaleX
        scale.y *= fitScaleY

        return scale
    }
}

const D = DragBoundsHelper