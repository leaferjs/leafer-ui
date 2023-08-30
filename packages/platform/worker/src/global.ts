import { PluginManager, useCanvas } from './worker'
import * as power from './worker'

LeaferUI = PluginManager.power = power
useCanvas('canvas')