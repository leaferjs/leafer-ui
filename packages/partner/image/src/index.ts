import { IPaintImageModule } from '@leafer-ui/interface'

import { image } from './image'
import { createData, getPatternData } from './data'
import { fillOrFitMode, clipMode, repeatMode, stretchMode } from './mode'
import { createPatternTask, createPattern, getPatternFixScale } from './pattern'
import { checkImage, drawImage, getImageRenderScaleData } from './check'
import { recycleImage } from './recycle'


export const PaintImageModule: IPaintImageModule = {
    image,

    checkImage,
    drawImage,
    getImageRenderScaleData,
    recycleImage,

    createPatternTask,
    createPattern,
    getPatternFixScale,

    createData,
    getPatternData,

    stretchMode,
    fillOrFitMode,
    clipMode,
    repeatMode
}