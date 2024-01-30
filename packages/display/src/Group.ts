import { IPickOptions, IPickResult, IPointData } from '@leafer/interface'
import { Branch, useModule, dataProcessor, registerUI, UICreator } from '@leafer/core'

import { IGroup, IGroupData, IGroupInputData, IUI, IUIInputData } from '@leafer-ui/interface'
import { GroupData } from '@leafer-ui/data'

import { UI } from './UI'


@useModule(Branch)
@registerUI()
export class Group extends UI implements IGroup {

    public get __tag() { return 'Group' }

    @dataProcessor(GroupData)
    declare public __: IGroupData

    declare public children: IUI[]

    constructor(data?: IGroupInputData) {
        super(data)
        this.__setBranch()
    }

    public __setBranch(): void {
        this.isBranch = true
        if (!this.children) this.children = []
    }

    // data

    public set(data: IUIInputData): void {
        if (data.children) {
            const { children } = data
            delete data.children

            if (!this.children) {
                this.__setBranch()
            } else {
                this.removeAll(true)
            }

            super.set(data)

            let child: IUI
            children.forEach(childData => {
                child = UICreator.get(childData.tag, childData) as IUI
                this.add(child)
            })

            data.children = children

        } else {
            super.set(data)
        }
    }

    public toJSON(): IUIInputData {
        const data = super.toJSON()
        data.children = this.children.map(child => child.toJSON())
        return data
    }


    // hit rewrite

    public pick(_hitPoint: IPointData, _options?: IPickOptions): IPickResult { return undefined }


    // add

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

    public addMany(..._children: IUI[]): void { }

    public remove(_child?: IUI, _destroy?: boolean): void { }

    public removeAll(_destroy?: boolean): void { }

    public clear(): void { }

}
