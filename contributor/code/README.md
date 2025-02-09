# 社区示例代码库

这是一个由社区参与维护的示例代码库，收录各种实用、炫酷的场景示例代码（单个页面代码）。

LeaferJS 能实现哪些效果，做出什么产品，由大家来一起诠释～

## 展示

收录的示例将通过社区 playground 环境展示给所有人浏览、学习、复用，并可用于 AI 训练：

https://www.leaferjs.com/playground/

## 如何开发、提交示例

**第一步：** 通过 [Cloud Studio](https://cloudstudio.net/?templateId=10064) 在线模版项目 或 [本地环境](https://www.leaferjs.com/ui/guide/runtime.html#%E6%9C%AC%E5%9C%B0%E7%8E%AF%E5%A2%83) 进行开发。

**第二步：** 开发完成并测试合格后，阅读 [代码提交规范](https://github.com/leaferjs/leafer-ui/blob/main/contributor/COMMIT_CONVENTION.md), 将代码（单文件） pull request。

**第三步：** 等待合并收录代码（低质量的代码有可能被拒），收录成功后将会出现在 playground 环境的 [社区列表](https://www.leaferjs.com/playground/#community) 中，比较有场景代表的会被同时收录到首页场景案例中。

## 代码示例

程序会自动从代码中提取标题、用户等关键信息用于展示，请按规则添加第 1、2 行注释。

代码在 [playground 环境](https://www.leaferjs.com/playground/) 需要能够正常运行。

```ts
// #标题 [可选子标题] (可选文章教程链接)
// @作者 (可选个人主页链接)
import { Leafer, Rect } from 'leafer-ui'

const leafer = new Leafer({ view: window })

leafer.add(Rect.one({ fill: '#32cd79', draggable: true }, 100, 100))
```

填充信息后的例子：

```ts
// #创建一个应用 (https://...)
// @Leafer (https://...)
import { Leafer, Rect } from 'leafer-ui'

const leafer = new Leafer({ view: window })

leafer.add(Rect.one({ fill: '#32cd79', draggable: true }, 100, 100))
```
