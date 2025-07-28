import { Platform, Creator } from '@leafer/core'

import { ISelector, ILeaf } from '@leafer-ui/interface'


Platform.getSelector = function (leaf: ILeaf): ISelector {
    return leaf.leafer ? leaf.leafer.selector : (Platform.selector || (Platform.selector = Creator.selector()))
}