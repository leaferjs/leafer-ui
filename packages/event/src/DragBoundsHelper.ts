import { IPointData, IBoundsData, IDragBoundsType, ILeaf, ISide } from '@leafer/interface'
import { Bounds, BoundsHelper, MathHelper, isFinite } from '@leafer/core'


const { min, max, abs } = Math, { float, sign } = MathHelper, { minX, maxX, minY, maxY } = BoundsHelper
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

        // 避免出现为0的抖动小数
        move.x = float(move.x)
        move.y = float(move.y)

        return move
    },

    getValidScaleOf(content: IBoundsData, dragBounds: IBoundsData, dragBoundsType: IDragBoundsType, origin: IPointData, scale: IPointData, lockRatio?: boolean, change?: boolean): IPointData {
        if (!change) scale = { ...scale }

        tempDragBounds.set(dragBounds)
        tempContent.set(content).scaleOf(origin, scale.x, scale.y)

        const originLeftScale = (origin.x - content.x) / content.width, originRightScale = 1 - originLeftScale
        const originTopScale = (origin.y - content.y) / content.height, originBottomScale = 1 - originTopScale

        let correctScaleX = 1, correctScaleY = 1, aScale: number, bScale: number, aSize: number, bSize: number

        if (D.isInnerMode(content, dragBounds, dragBoundsType, 'width')) {  // inner 模式

            if (scale.x < 0) tempContent.scaleOf(origin, correctScaleX = 1 / scale.x, 1) // 阻止镜像

            aSize = float(tempContent.minX - tempDragBounds.minX)
            bSize = float(tempDragBounds.maxX - tempContent.maxX)

            aScale = originLeftScale && aSize > 0 ? 1 + aSize / (originLeftScale * tempContent.width) : 1
            bScale = originRightScale && bSize > 0 ? 1 + bSize / (originRightScale * tempContent.width) : 1
            correctScaleX *= max(aScale, bScale)

        } else { // outer 模式

            if (scale.x < 0) {
                if (float(minX(content) - minX(dragBounds)) <= 0 || float(maxX(dragBounds) - maxX(content)) <= 0) tempContent.scaleOf(origin, correctScaleX = 1 / scale.x, 1) // 到达边界时阻止镜像
                tempContent.unsign()
            }

            aSize = float(tempDragBounds.minX - tempContent.minX)
            bSize = float(tempContent.maxX - tempDragBounds.maxX)

            aScale = originLeftScale && aSize > 0 ? 1 - aSize / (originLeftScale * tempContent.width) : 1
            bScale = originRightScale && bSize > 0 ? 1 - bSize / (originRightScale * tempContent.width) : 1
            correctScaleX *= min(aScale, bScale)

        }

        if (D.isInnerMode(content, dragBounds, dragBoundsType, 'height')) { // inner 模式

            if (scale.y < 0) tempContent.scaleOf(origin, 1, correctScaleY = 1 / scale.y) // 阻止镜像

            aSize = float(tempContent.minY - tempDragBounds.minY)
            bSize = float(tempDragBounds.maxY - tempContent.maxY)

            aScale = originTopScale && aSize > 0 ? 1 + aSize / (originTopScale * tempContent.height) : 1
            bScale = originBottomScale && bSize > 0 ? 1 + bSize / (originBottomScale * tempContent.height) : 1

            correctScaleY *= max(aScale, bScale)

            if (lockRatio) {
                aScale = max(abs(correctScaleX), abs(correctScaleY))
                correctScaleX = sign(correctScaleX) * aScale
                correctScaleY = sign(correctScaleY) * aScale
            }

        } else { // outer 模式

            if (scale.y < 0) {
                if (float(minY(content) - minY(dragBounds)) <= 0 || float(maxY(dragBounds) - maxY(content)) <= 0) tempContent.scaleOf(origin, 1, correctScaleY = 1 / scale.y) // 到达边界时阻止镜像
                tempContent.unsign()
            }

            aSize = float(tempDragBounds.minY - tempContent.minY)
            bSize = float(tempContent.maxY - tempDragBounds.maxY)

            aScale = originTopScale && aSize > 0 ? 1 - aSize / (originTopScale * tempContent.height) : 1
            bScale = originBottomScale && bSize > 0 ? 1 - bSize / (originBottomScale * tempContent.height) : 1
            correctScaleY *= min(aScale, bScale)

        }

        scale.x *= isFinite(correctScaleX) ? correctScaleX : 1
        scale.y *= isFinite(correctScaleY) ? correctScaleY : 1

        return scale
    }
}

const D = DragBoundsHelper