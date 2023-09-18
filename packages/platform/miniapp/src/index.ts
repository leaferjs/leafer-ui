export * from './miniapp'

import { useCanvas } from './miniapp'
import * as power from './miniapp'

import { PluginManager } from '@leafer-ui/core'

PluginManager.power = power

try {
    useCanvas('wx', wx)
} catch { }