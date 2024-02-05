import { IPathCommandData } from '@leafer/interface'
import { IArrowType, IPathArrowModule } from '@leafer-ui/interface'


export const PathArrowModule: IPathArrowModule = {
    add(path: IPathCommandData, startArrow?: IArrowType, endArrow?: IArrowType): IPathCommandData {
        if (startArrow) { }
        if (endArrow) { }
        return path
    }
}