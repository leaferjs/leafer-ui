import { IPaintImageModule } from '@leafer-ui/interface'

import { image } from './image'
import { createData } from './data'
import { fillOrFitMode, clipMode, repeatMode } from './mode'
import { createPattern } from './pattern'
import { checkImage } from './check'
import { recycleImage } from './recycle'


export const PaintImageModule: IPaintImageModule = {
    image,
    createData,
    fillOrFitMode,
    clipMode,
    repeatMode,
    createPattern,
    checkImage,
    recycleImage
}