# 社区示例代码库

这是一个由社区参与维护的示例代码库，收录各种实用、炫酷的场景示例代码（单个页面代码）。

LeaferJS 能实现哪些效果，做出什么产品，由大家来一起诠释～

## 展示

收录的示例将通过社区 playground 环境展示给所有人浏览、复用，并用于 AI 训练：

https://www.leaferjs.com/playground/

## 示例

请务必按规则添加第一行和第二行注释，程序将自动提取标题等关键信息用于展示。

请确保代码在 playground 环境能够正常运行。

```ts
// #标题 [可选子标题] (可选示例文章教程链接)
// @作者 Leafer (可选个人主页链接) - LeaferJS v1.4.0
import { Leafer, Rect } from 'leafer-ui'

const leafer = new Leafer({
  view: window,
  width: 600, // 不能设置为 0， 否则会变成自动布局
  height: 600,
  fill: '#333',
})

leafer.add(Rect.one({ fill: '#32cd79', draggable: true }, 100, 100))
```
