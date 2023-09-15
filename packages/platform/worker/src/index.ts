export * from './worker'

import { PluginManager, useCanvas } from './worker'
import * as power from './worker'

PluginManager.power = power
useCanvas('canvas')