[English](./README-EN.md) | 简体中文

<br/>

# LeaferJS：好用的 Canvas 引擎

轻松实现图形交互与编辑，AI 时代的无限画布引擎

官网: [leaferjs.com](https://www.leaferjs.com)

森林: [leafer.pro](https://www.leafer.pro)

**👉 在浏览器里 “跑得动 100 万个图形” 的 Canvas 引擎**  
**👉 可以做 “Figma 级编辑器” 的 Canvas 内核**

<p align="center">
  <a href="https://www.bilibili.com/video/BV1E56vBwEiB" target="_blank">
    <img src="https://www.leaferjs.com/image/video/leaferjs.jpg?d=1126" />
  </a>
</p>
<p align="center">
<b>极致性能 · 极低内存 · 类 DOM API · 图形编辑 · 跨平台 · 零依赖 · 轻量 (70KB min+gzip)</b>
</p>

<div align="center">

[![NPM Downloads](https://img.shields.io/npm/dm/@leafer-ui/draw?style=flat-square&color=32cd79)](https://www.npmjs.com/package/@leafer-ui/draw)
[![GitHub Stars](https://img.shields.io/github/stars/leaferjs/leafer-ui?style=flat-square&label=Stars&color=ffd700)](https://github.com/leaferjs/leafer-ui/stargazers)
[![GitHub Release](https://img.shields.io/github/v/release/leaferjs/leafer-ui)](https://github.com/leaferjs/leafer-ui/releases)
[![GitHub License](https://img.shields.io/github/license/leaferjs/leafer-ui)](https://github.com/leaferjs/leafer-ui/blob/main/LICENSE)

</div>

## 🧐 为什么选择LeaferJS？

在 Web 图形开发中，开发者常面临“性能与易用性”的选型困境。

**LeaferJS 致力于终结这种权衡。** 它从底层重构，不仅在性能上挑战 Web 渲染和交互的物理极限，更在开发体验上追求极致的简单。它是为了解决“大规模、高密度、海量图层”的生产力工具而诞生的标准化引擎。

## 🏗️ 为什么是 AI 时代的无限画布引擎？

在 AI 生成内容爆发的今天，图形引擎的挑战已从 **“如何画出来”** 转变为 **“如何编排与精修”**：

- **⚡ 极致承载力：** 突破极限，百万交互图层依然保持丝滑响应，完美承载 AI 生成的海量碎片。
- **🤖 语义化编辑：** 结构化场景树让 AI 能像操作 DOM 一样操控图形，构建真正的 AI 协同工作流。
- **🛠️ 原生编辑器：** 内置 Editor 插件，让AI 生成的内容一键获得精准旋转、缩放、多选等工业级编辑能力。

[Leafer AI 知识库](https://github.com/leaferjs/ai-docs) | [MCP & Skills](https://context7.com/leaferjs/ai-docs?tab=skills) | [Ask AI](https://context7.com/leaferjs/ai-docs?tab=chat)

## 🎨 应用场景

LeaferJS 的极致性能与标准化能力，使其成为以下领域的理想底座：

- 🤖 **AI 场景：** AI 无限画布、AI 设计工具、生成式 UI 交互。
- 🛠️ **生产力工具：** 图形编辑器、在线设计平台（Figma/Canva 类）、电子白板、低代码引擎。
- 📊 **工业可视化：** 万级节点电力组态、流程图、资产监控、大规模拓扑图。
- 🎬 **数字内容生成：** 批量生成图片/海报、短视频帧渲染（Node.js 端）、互动 H5。
- 🎮 **互动应用：** 轻量小游戏、品牌互动应用、高频交互数据大屏。

## 🔥 性能表现

LeaferJS 将 Web 图形处理的“天花板”向上推举了约 10 倍。

| 测试项 (100万个可交互矩形) | 传统 Canvas 库          | **LeaferJS** | 提升             |
| :------------------------- | :---------------------- | :----------- | :--------------- |
| **首屏创建速度**           | ~9-15 秒                | **1.28 秒**  | **约快 8 倍 🎉** |
| **内存占用**               | ~2-4GB (浏览器可能崩溃) | **320 MB**   | **约节省 8 倍**  |
| **单元素拖拽帧率**         | 0-4 FPS                 | **60 FPS**   | **约流畅 15 倍** |

测试环境: 2K屏笔记本 / Chrome V143.0，数据仅供参考，实际表现取决于硬件性能。

[性能对比详情](https://www.leaferjs.com/#performance) | [性能基准测试](https://benchmark.leaferjs.com/leafer/)

## ⚡️ 核心能力

- **🎨 强大的图形系统：** 完整的场景树结构，支持矢量图形、SVG 路径及像素操作。
- **🧠 极致的交互响应：** 原生支持拖拽、缩放、多点触控，毫秒级的命中检测（Hit Testing）。
- **🛠️ 原生编辑器支持：** 内置 **Editor 插件**，一键开启图形的**缩放、旋转、移动、多选**等功能。
- **🧩 现代布局引擎：** 业内罕见地在 Canvas 引擎中原生支持 **Flex 布局**，像写 HTML 一样自然。
- **🎬 状态驱动动画：** 内置高性能过渡效果与路径动画，让动态交互更简单。
- **🌍 全平台适配：** 一套代码完美运行于 Web、Node.js、微信小程序及移动端 H5 环境。

[功能列表详情](https://www.leaferjs.com/#different) | [在线体验](https://www.leaferjs.com/examples/)

## 🛠️ 快速上手

```sh
npm install leafer-ui

# 需使用插件时，推荐同时安装跨平台核心包，防止出现更新版本不同步问题
npm install leafer-ui @leafer-ui/core @leafer-ui/draw
```

```ts
import { Leafer, Rect } from 'leafer-ui'

// 创建一个自适应窗口的交互应用
const leafer = new Leafer({ view: window })

// 创建一个可以被拖拽的矩形
const rect = new Rect({
  x: 100,
  y: 100,
  width: 200,
  height: 200,
  fill: '#32cd79',
  draggable: true,
})

leafer.add(rect)
```

[在线运行示例](https://www.leaferjs.com/examples/#official%2Fstart%2Fcreate.ts) | [图形编辑示例](https://www.leaferjs.com/examples/#official%2Fplugin%2Feditor%2Fframe%2Ftransparent.ts)

## 💼 商业支持与可持续性

从“一个引擎”到“一个成熟产品”之间存在巨大的研发鸿沟。为了支持开源引擎的长久维护，并协助企业跨越复杂场景的开发瓶颈，我们构建了透明且健康的生态：

- **LeaferJS 永久开源 (MIT)：** 核心功能和基础插件始终保持开源与自由，能够满足绝大多数项目需求，让开发者拥有安全、可控、可持续的技术选择，无需担心核心能力受到商业限制。
- **[PxGrow](https://www.pxgrow.com/) 提供可选商业插件：** 专注于解决**工业级应用**中的复杂业务难题。包括专业编辑器套件、复杂图形算法与性能优化能力，帮助企业节省数月甚至数年的研发投入。
- **良性循环与长期主义：** 开发者因开源受益，企业因商业能力提效，而商业支持又持续推动 LeaferJS 的发展与创新，形成开放、透明、可持续的发展循环。

### LeaferJS 仓库组成一览表

| 仓库名称      | 功能描述                     | 开源地址                                        |
| :------------ | :--------------------------- | :---------------------------------------------- |
| **LeaferJS**  | 主集成仓库，支持直接运行代码 | [GitHub](https://github.com/leaferjs/LeaferJS)  |
| **leafer**    | 引擎核心仓库                 | [GitHub](https://github.com/leaferjs/leafer)    |
| **leafer-ui** | UI 表现层仓库                | [GitHub](https://github.com/leaferjs/leafer-ui) |
| **leafer-in** | 官方插件仓库                 | [GitHub](https://github.com/leaferjs/leafer-in) |
| **leafer-x**  | 社区插件提交/展示仓库        | [GitHub](https://github.com/leaferjs/leafer-x)  |
| **test**      | 自动化测试仓库               | [GitHub](https://github.com/leaferjs/test)      |
| **code**      | 示例代码仓库                 | [GitHub](https://github.com/leaferjs/code)      |
| **docs**      | 在线文档仓库                 | [GitHub](https://github.com/leaferjs/docs)      |

## 🌟 参与贡献：五年沉淀，始于初心

LeaferJS 是一个持续打磨了五年的原创开源引擎。我们致力于把“图形系统底座”这件事标准化，让开发者专注产品创意，而非底层实现。

**如果你支持原创、追求极致性能，请为我们点亮一颗 Star！**

<div style="display:flex; gap: 12px">
<a target="_blank" href="https://github.com/leaferjs/leafer-ui" aria-label="github"  rel="noopener">
  <img width="120" title="github" src="https://img.shields.io/github/stars/leaferjs/ui?style=social" />
</a>
</div>

- 🌟 **Star 仓库：** 你的认可对我们至关重要。
- 🐞 **提交反馈：** 每一个 Issue 都是我们进步的机会。
- 🤝 **加入社区：** 与社区开发者共同探索 Web 图形技术的极限。

## 贡献指南

当你使用 LeaferJS 时, 你就已成为了 这个充满活力的大家庭 的一员，踏入这座建设中的“技术城堡”。只有通过每位成员的热情参与与贡献，这座城堡才能逐步走向完善。

[社区行为准则](./contributor/CODE_OF_CONDUCT.md)

[代码提交规范](./contributor/COMMIT_CONVENTION.md)

[提问的智慧](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way/blob/main/README-zh_CN.md#%E6%8F%90%E9%97%AE%E7%9A%84%E6%99%BA%E6%85%A7)

## 致谢贡献者

[每一位参与开源森林的创作者](https://www.leafer.pro/#creator)

[每一位贡献代码的社区成员](https://github.com/leaferjs/leafer-ui/graphs/contributors)

[早期参与生态的社区成员](https://www.leaferjs.com/ui/contribute/)

## 致谢赞助商

[每一位参与赞助过我们的用户](https://www.leaferjs.com/#footer-sponsor)

## License

MIT 开源许可协议，可以免费使用，且能用于商业场景。

Copyright © 2023-present Chao (Leafer) Wan
