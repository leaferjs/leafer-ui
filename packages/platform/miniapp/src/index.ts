export * from './miniapp'

import { PluginManager, useCanvas } from './miniapp'
import * as power from './miniapp'

PluginManager.power = power
useCanvas('wx')