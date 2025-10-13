import { IPaintImageModule } from '@leafer-ui/interface'

import { image } from './image'
import { createData, getPatternData } from './data'
import { fillOrFitMode, clipMode, repeatMode, stretchMode } from './mode'
import { createPatternTask, createPattern, createPatternStyle } from './pattern'
import { checkImage, drawImage } from './check'
import { recycleImage } from './recycle'


export const PaintImageModule: IPaintImageModule = {
    image,

    checkImage,
    drawImage,
    recycleImage,

    createPatternTask,
    createPattern,
    createPatternStyle,

    createData,
    getPatternData,

    stretchMode,
    fillOrFitMode,
    clipMode,
    repeatMode
}