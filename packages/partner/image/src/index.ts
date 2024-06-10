import { IPaintImageModule } from '@leafer-ui/interface'

import { image } from './image'
import { createData, getPatternData } from './data'
import { fillOrFitMode, clipMode, repeatMode } from './mode'
import { createPattern } from './pattern'
import { checkImage } from './check'
import { recycleImage } from './recycle'


export const PaintImageModule: IPaintImageModule = {
    image,
    checkImage,
    createPattern,
    recycleImage,

    createData,
    getPatternData,
    fillOrFitMode,
    clipMode,
    repeatMode
}