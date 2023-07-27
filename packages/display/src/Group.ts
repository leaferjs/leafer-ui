import { Branch, useModule, dataProcessor, registerUI } from '@leafer/core'

import { IGroup, IGroupData, IGroupInputData, IUI } from '@leafer-ui/interface'
import { GroupData } from '@leafer-ui/data'

import { UI } from './UI'


@useModule(Branch)
@registerUI()
export class Group extends UI implements IGroup {

    public get __tag() { return 'Group' }

    @dataProcessor(GroupData)
    public __: IGroupData

    public children: IUI[]

    public set mask(child: IUI) {
        if (this.__hasMask) this.__removeMask()
        if (child) {
            child.isMask = true
            this.addAt(child, 0)
        }
    }
    public get mask(): IUI {
        return this.children.find(item => item.isMask)
    }

    constructor(data?: IGroupInputData) {
        super(data)
        this.isBranch = true
        this.children = []
    }

    public addAt(child: IUI, index: number): void {
        this.add(child, index)
    }

    public addAfter(child: IUI, after: IUI): void {
        this.add(child, this.children.indexOf(after) + 1)
    }

    public addBefore(child: UI, before: IUI): void {
        this.add(child, this.children.indexOf(before))
    }

    // Branch rewrite

    public add(_child: IUI, _index?: number): void { }

    public remove(_child?: IUI): void { }

    public removeAll(): void { }

}
