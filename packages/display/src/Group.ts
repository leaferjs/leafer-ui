import { IJSONOptions, IPickOptions, IPickResult, IPointData, INumber, ITransition } from '@leafer/interface'
import { Branch, useModule, dataProcessor, registerUI, boundsType } from '@leafer/core'

import { IGroup, IGroupData, IGroupInputData, IUI, IUIInputData, IUIJSONData, IFindCondition, IFindUIMethod } from '@leafer-ui/interface'
import { GroupData } from '@leafer-ui/data'

import { UI } from './UI'


@useModule(Branch)
@registerUI()
export class Group<TInputData = IGroupInputData> extends UI<TInputData> implements IGroup {   // tip: rewrited Box

    public get __tag() { return 'Group' }

    public get isBranch(): boolean { return true }

    @dataProcessor(GroupData)
    declare public __: IGroupData

    // size
    @boundsType(0)
    declare public width?: INumber

    @boundsType(0)
    declare public height?: INumber

    declare public children: IUI[]

    declare public topChildren?: IUI[]

    public childlessJSON?: boolean


    public reset(data?: IGroupInputData): void {
        this.__setBranch()
        super.reset(data)
    }

    public __setBranch(): void {
        if (!this.children) this.children = []
    }


    // data

    override set(data: IUIInputData, transition?: ITransition | 'temp'): void {
        if (data) {
            if (data.children) {
                const { children } = data

                delete data.children
                this.children ? this.clear() : this.__setBranch()

                super.set(data, transition)

                children.forEach(child => this.add(child))
                data.children = children

            } else super.set(data, transition)
        }
    }

    override toJSON(options?: IJSONOptions): IUIJSONData {
        const data = super.toJSON(options)
        if (!this.childlessJSON) {
            const children: IUIJSONData[] = data.children = []
            this.children.forEach(child => child.skipJSON || children.push(child.toJSON(options)))
        }
        return data
    }

    // add

    public addAt(child: IUI | IUI[] | IUIInputData | IUIInputData[], index: number): void {
        this.add(child, index)
    }

    public addAfter(child: IUI | IUI[] | IUIInputData | IUIInputData[], after: IUI): void {
        this.add(child, this.children.indexOf(after) + 1)
    }

    public addBefore(child: IUI | IUI[] | IUIInputData | IUIInputData[], before: IUI): void {
        this.add(child, this.children.indexOf(before))
    }

}

export interface Group {

    // hit rewrite
    pick(hitPoint: IPointData, options?: IPickOptions): IPickResult

    // Branch rewrite
    add(child: IUI | IUI[] | IUIInputData | IUIInputData[], index?: number): void
    addMany(...children: IUI[] | IUIInputData[]): void
    remove(child?: IUI | number | string | IFindCondition | IFindUIMethod, destroy?: boolean): void
    removeAll(_destroy?: boolean): void
    clear(): void

}