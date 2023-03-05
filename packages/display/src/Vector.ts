import { dataProcessor, pathType, registerUI } from '@leafer/core'

import { IVectorPath, IVectorPathString, IVector, IVectorData, IVectorInputData } from '@leafer-ui/interface'
import { VectorData } from '@leafer-ui/data'

import { Group } from './Group'


@registerUI()
export class Vector extends Group implements IVector {

    @dataProcessor(VectorData)
    public __: IVectorData

    @pathType()
    public paths: IVectorPath[] | IVectorPathString

    constructor(data?: IVectorInputData) {
        super(data)
    }

    public __updatePath(): void {

    }

}