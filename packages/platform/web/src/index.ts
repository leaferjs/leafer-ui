export * from './web'

import { useCanvas } from './web'
import * as power from './web'

import { PluginManager } from '@leafer-ui/core'

PluginManager.power = power
useCanvas('canvas')