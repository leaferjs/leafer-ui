import { IUIEvent, ILeaf, ILeafList } from '@leafer/interface'
import { EventCreator, Debug } from '@leafer/core'

const debug = Debug.get('emit')

export function emit(type: string, data: IUIEvent, path?: ILeafList, excludePath?: ILeafList): void {
    if (!path && !data.path) return

    let leaf: ILeaf
    data.type = type
    if (path) {
        data = { ...data, path }
    } else {
        path = data.path
    }

    data.target = path.indexAt(0)

    try {

        // capture
        for (let i = path.length - 1; i > -1; i--) {
            leaf = path.list[i]
            if (emitEvent(leaf, type, data, true, excludePath)) return
            if (leaf.isApp) emitAppChildren(leaf, type, data, true, excludePath) //  other leafer
        }

        // bubble
        for (let i = 0, len = path.length; i < len; i++) {
            leaf = path.list[i]
            if (leaf.isApp) emitAppChildren(leaf, type, data, false, excludePath) //  other leafer
            if (emitEvent(leaf, type, data, false, excludePath)) return
        }

    } catch (e) {
        debug.error(e)
    }
}

const allowTypes = ['move', 'zoom', 'rotate', 'key']
function emitAppChildren(leaf: ILeaf, type: string, data: IUIEvent, capture?: boolean, excludePath?: ILeafList): void {
    if (allowTypes.some(name => type.startsWith(name)) && leaf.__.hitChildren && !exclude(leaf, excludePath)) {
        let child: ILeaf
        for (let i = 0, len = leaf.children.length; i < len; i++) {
            child = leaf.children[i]
            if (!data.path.has(child) && child.__.hittable) emitEvent(child, type, data, capture, excludePath) //  other leafer
        }
    }
}

function emitEvent(leaf: ILeaf, type: string, data: IUIEvent, capture?: boolean, excludePath?: ILeafList): boolean {
    if (leaf.destroyed) return true
    if (leaf.__.hitSelf && leaf.hasEvent(type, capture) && !exclude(leaf, excludePath)) {
        data.phase = capture ? 1 : ((leaf === data.target) ? 2 : 3)
        const event = EventCreator.get(type, data)
        leaf.emitEvent(event, capture)
        if (event.isStop) return true
    }
    return false
}

function exclude(leaf: ILeaf, excludePath?: ILeafList): boolean {
    return excludePath && excludePath.has(leaf)
}