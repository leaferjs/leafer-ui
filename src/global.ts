import { PluginManager, useCanvas } from '@leafer-ui/web'
import * as power from '@leafer-ui/web'

(window as any).LeaferUI = PluginManager.power = power
useCanvas('canvas')