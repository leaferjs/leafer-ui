import { IPointData, IBoundsData, IDragBoundsType, ILeaf, ISide } from '@leafer/interface'
import { Bounds, MathHelper } from '@leafer/core'


const { float } = MathHelper
const tempContent = new Bounds(), tempMerge = new Bounds(), tempIntersect = new Bounds()

export const DragBoundsHelper = {

    // 拖拽区域内移动
    limitMove(leaf: ILeaf, move: IPointData): void {
        const { dragBounds, dragBoundsType } = leaf
        if (dragBounds) D.getValidMove(leaf.__localBoxBounds, D.getDragBounds(leaf), dragBoundsType, move, true)
        D.axisMove(leaf, move)
    },

    // 拖拽区域内缩放
    limitScaleOf(leaf: ILeaf, origin: IPointData, scale: IPointData): void {
        const { dragBounds, dragBoundsType } = leaf
        if (dragBounds) D.getValidScaleOf(leaf.__localBoxBounds, D.getDragBounds(leaf), dragBoundsType, leaf.getLocalPointByInner(leaf.getInnerPointByBox(origin)), scale, true)
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

    getValidScaleOf(content: IBoundsData, dragBounds: IBoundsData, dragBoundsType: IDragBoundsType, origin: IPointData, scale: IPointData, change?: boolean): IPointData {
        if (!change) scale = { ...scale }

        let fitScaleX: number, fitScaleY: number

        tempContent.set(content).scaleOf(origin, scale.x, scale.y).unsign()
        tempMerge.set(tempContent).add(dragBounds)
        tempIntersect.set(tempContent).intersect(dragBounds)

        if (D.isInnerMode(content, dragBounds, dragBoundsType, 'width')) {  // inner 模式
            fitScaleX = tempMerge.width / tempContent.width
        } else { // outer 模式
            fitScaleX = tempIntersect.width / tempContent.width
        }

        if (D.isInnerMode(content, dragBounds, dragBoundsType, 'height')) { // inner 模式
            fitScaleY = tempMerge.height / tempContent.height
        } else { // outer 模式
            fitScaleY = tempIntersect.height / tempContent.height
        }

        scale.x = float(tempIntersect.width) ? scale.x * fitScaleX : 1
        scale.y = float(tempIntersect.height) ? scale.y * fitScaleY : 1

        return scale
    }
}

const D = DragBoundsHelper