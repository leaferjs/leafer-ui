import { IColorConvertModule, IColor, IRGBA } from '@leafer-ui/interface'
import { needPlugin } from '@leafer/core'

import { string } from './color'


export const ColorConvertModule: IColorConvertModule = {
    string,
    object(_color: IColor, _opacity?: number): IRGBA {
        return needPlugin('color')
    }
}