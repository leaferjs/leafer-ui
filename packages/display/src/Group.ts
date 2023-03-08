import { Branch, useModule, dataProcessor, registerUI } from '@leafer/core'

import { IGroup, IGroupData, IGroupInputData, IUI } from '@leafer-ui/interface'
import { GroupData } from '@leafer-ui/data'

import { UI } from './UI'


@useModule(Branch)
@registerUI()
export class Group extends UI implements IGroup {

    @dataProcessor(GroupData)
    public __: IGroupData

    public children: IUI[]

    constructor(data?: IGroupInputData) {
        super(data)
        this.__isBranch = true
        this.children = []
    }

    public __updatePath(): void {

    }

    public add(_child: IUI, _index?: number): void { } // Branch rewrite

    public addAt(child: IUI, index: number): void {
        this.add(child, index)
    }

    public addAfter(child: IUI, after: IUI): void {
        this.add(child, this.children.indexOf(after) + 1)
    }

    public addBefore(child: UI, before: IUI): void {
        this.add(child, this.children.indexOf(before))
    }

    public remove(_child?: IUI): void { }  // Branch rewrite

}
