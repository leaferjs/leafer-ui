export * from '@leafer/miniapp'
export * from '@leafer-ui/core'
export * from '@leafer-ui/partner'

import { useCanvas } from '@leafer/miniapp'

try {
    useCanvas('wx', wx)
} catch { }