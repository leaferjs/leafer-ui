export * from './worker'

import { useCanvas } from './worker'
import * as power from './worker'

import { PluginManager } from '@leafer-ui/core'

PluginManager.power = power
useCanvas('canvas')