export * from '@leafer-ui/web'

import { PluginManager, useCanvas } from '@leafer-ui/web'
import * as power from '@leafer-ui/web'

PluginManager.power = power
useCanvas('canvas')