import { IPointData, IBoundsData, IDragBoundsType, ILeaf } from '@leafer/interface'


export const DragBoundsHelper = {

    getValidMove(content: IBoundsData, dragBounds: IBoundsData, dragBoundsType: IDragBoundsType, move: IPointData, change?: boolean): IPointData {
        const x = content.x + move.x, y = content.y + move.y, right = x + content.width, bottom = y + content.height
        const boundsRight = dragBounds.x + dragBounds.width, boundsBottom = dragBounds.y + dragBounds.height

        if (!change) move = { ...move }

        const isBiggerWidth = content.width > dragBounds.width
        const isBiggerHeight = content.height > dragBounds.height

        if (isBiggerWidth && dragBoundsType !== 'outer') {  // inner / auto 模式
            if (x > dragBounds.x) move.x += dragBounds.x - x
            else if (right < boundsRight) move.x += boundsRight - right
        } else {
            if (x < dragBounds.x) move.x += dragBounds.x - x
            else if (right > boundsRight) move.x += boundsRight - right
        }

        if (isBiggerHeight && dragBoundsType !== 'outer') { // inner / auto 模式
            if (y > dragBounds.y) move.y += dragBounds.y - y
            else if (bottom < boundsBottom) move.y += boundsBottom - bottom
        } else {
            if (y < dragBounds.y) move.y += dragBounds.y - y
            else if (bottom > boundsBottom) move.y += boundsBottom - bottom
        }

        return move
    },

    // 按轴移动
    axisMove(leaf: ILeaf, move: IPointData) {
        const { draggable } = leaf
        if (draggable === 'x') move.y = 0
        if (draggable === 'y') move.x = 0
    },

    // 拖拽区域内移动
    limitMove(leaf: ILeaf, move: IPointData): void {
        const { dragBounds, dragBoundsType } = leaf
        if (dragBounds) D.getValidMove(leaf.__localBoxBounds, dragBounds === 'parent' ? leaf.parent.boxBounds : dragBounds, dragBoundsType, move, true)
        D.axisMove(leaf, move)
    }
}

const D = DragBoundsHelper