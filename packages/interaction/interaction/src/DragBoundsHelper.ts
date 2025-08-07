import { IPointData, IBoundsData, IDragBoundsType } from '@leafer/interface'
import { BoundsHelper } from '@leafer/core'


export const DragBoundsHelper = {

    getValidMove(content: IBoundsData, dragBounds: IBoundsData, dragBoundsType: IDragBoundsType, move: IPointData, change?: boolean): IPointData {
        const x = content.x + move.x, y = content.y + move.y, right = x + content.width, bottom = y + content.height
        const boundsRight = dragBounds.x + dragBounds.width, boundsBottom = dragBounds.y + dragBounds.height

        if (!change) move = { ...move }

        if (BoundsHelper.includes(content, dragBounds)) { // childBox 包含 dragBounds
            if (dragBoundsType !== 'outer') { // inner / auto 模式
                if (x > dragBounds.x) move.x += dragBounds.x - x
                else if (right < boundsRight) move.x += boundsRight - right

                if (y > dragBounds.y) move.y += dragBounds.y - y
                else if (bottom < boundsBottom) move.y += boundsBottom - bottom
            }
        } else {
            if (x < dragBounds.x) move.x += dragBounds.x - x
            else if (right > boundsRight) move.x += boundsRight - right

            if (y < dragBounds.y) move.y += dragBounds.y - y
            else if (bottom > boundsBottom) move.y += boundsBottom - bottom
        }

        return move
    }
}