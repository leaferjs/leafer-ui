English | [简体中文](./README.md)

<br/>

# LeaferJS: An Easy-to-Use Canvas Engine

Effortlessly build graphic interaction and editing — an infinite canvas engine for the AI era

Official Website: [leaferjs.com](https://www.leaferjs.com)

Forest: [leafer.pro](https://www.leafer.pro)

**👉 A Canvas engine that can handle 1 million graphics in the browser**  
**👉 A Canvas core capable of building Figma-level editors**

<p align="center">
  <a href="https://www.youtube.com/watch?v=bJ6fHMQdATs" target="_blank">
    <img src="https://www.leaferjs.com/image/video/leaferjs-en.jpg" />
  </a>
</p>
<p align="center">
<b>Extreme Performance · Ultra-Low Memory · DOM-like API · Graphic Editing · Cross-Platform · Zero Dependencies · Lightweight (70KB min+gzip)</b>
</p>

<div align="center">

[![NPM Downloads](https://img.shields.io/npm/dm/@leafer-ui/draw?style=flat-square&color=32cd79)](https://www.npmjs.com/package/@leafer-ui/draw)
[![GitHub Stars](https://img.shields.io/github/stars/leaferjs/leafer-ui?style=flat-square&label=Stars&color=ffd700)](https://github.com/leaferjs/leafer-ui/stargazers)
[![GitHub Release](https://img.shields.io/github/v/release/leaferjs/leafer-ui)](https://github.com/leaferjs/leafer-ui/releases)
[![GitHub License](https://img.shields.io/github/license/leaferjs/leafer-ui)](https://github.com/leaferjs/leafer-ui/blob/main/LICENSE)

</div>

## 🧐 Why Choose LeaferJS?

In Web graphics development, developers often face a trade-off between **performance and usability**.

**LeaferJS aims to eliminate this compromise.** Rebuilt from the ground up, it not only pushes the limits of Web rendering and interaction performance, but also pursues ultimate simplicity in developer experience. It is a standardized engine designed for productivity tools handling **large-scale, high-density, and massive-layer graphics**.

## 🏗️ Why an Infinite Canvas Engine for the AI Era?

With the explosion of AI-generated content, the challenge for graphics engines has shifted from **“how to render”** to **“how to organize and refine”**:

- **⚡ Extreme Capacity:** Handles millions of interactive layers smoothly, perfectly accommodating massive AI-generated fragments.
- **🤖 Semantic Editing:** A structured scene tree allows AI to manipulate graphics like the DOM, enabling true AI collaborative workflows.
- **🛠️ Native Editor:** Built-in Editor plugin enables one-click access to industrial-grade editing features such as rotation, scaling, and multi-selection for AI-generated content.

[Leafer AI Knowledge Base](https://github.com/leaferjs/ai-docs) | [MCP & Skills](https://context7.com/leaferjs/ai-docs?tab=skills) | [Ask AI](https://context7.com/leaferjs/ai-docs?tab=chat)

## 🎨 Use Cases

With its extreme performance and standardized capabilities, LeaferJS is an ideal foundation for:

- 🤖 **AI Applications:** Infinite AI canvas, AI design tools, generative UI interactions.
- 🛠️ **Productivity Tools:** Graphic editors, online design platforms (Figma/Canva-like), whiteboards, low-code engines.
- 📊 **Industrial Visualization:** Large-scale node systems, flowcharts, asset monitoring, massive topology diagrams.
- 🎬 **Digital Content Generation:** Batch image/poster generation, short video frame rendering (Node.js), interactive H5.
- 🎮 **Interactive Applications:** Lightweight games, brand interactive apps, high-frequency data dashboards.

## 🔥 Performance

LeaferJS pushes the ceiling of Web graphics processing by approximately **10x**.

| Test (1M Interactive Rectangles) | Traditional Canvas Libraries | **LeaferJS** | Improvement       |
| :------------------------------- | :--------------------------- | :----------- | :---------------- |
| **Initial Render Time**          | ~9–15 seconds                | **1.28s**    | **~8x faster 🎉** |
| **Memory Usage**                 | ~2-4GB (may crash browser)   | **320MB**    | **~8x lower**     |
| **Drag FPS (single element)**    | 0–4 FPS                      | **60 FPS**   | **~15x faster**   |

Test environment: 2K laptop screen / Chrome V143.0. Results are for reference only; actual performance depends on hardware.

[Performance Details](https://www.leaferjs.com/#performance) | [Benchmark](https://benchmark.leaferjs.com/leafer/)

## ⚡️ Core Capabilities

- **🎨 Powerful Graphics System:** Complete scene tree supporting vector graphics, SVG paths, and pixel operations.
- **🧠 Ultra-Fast Interaction:** Native support for drag, zoom, multi-touch, and millisecond-level hit testing.
- **🛠️ Built-in Editor Support:** Integrated **Editor plugin** enabling **scale, rotate, move, multi-select** with one click.
- **🧩 Modern Layout Engine:** Rare native **Flexbox layout** support in a Canvas engine — as natural as writing HTML.
- **🎬 State-Driven Animation:** Built-in high-performance transitions and path animations for smooth dynamic interactions.
- **🌍 Cross-Platform:** One codebase runs seamlessly on Web, Node.js, WeChat Mini Programs, and mobile H5.

[Full Feature List](https://www.leaferjs.com/#different) | [Live Examples](https://www.leaferjs.com/examples/)

## 🛠️ Quick Start

```sh
npm install leafer-ui

# When using plugins, it is recommended to install core packages together
# to avoid version mismatch issues
npm install leafer-ui @leafer-ui/core @leafer-ui/draw
```

```ts
import { Leafer, Rect } from 'leafer-ui'

// Create an interactive app that adapts to the window
const leafer = new Leafer({ view: window })

// Create a draggable rectangle
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

[Run Online Example](https://www.leaferjs.com/examples/#official%2Fstart%2Fcreate.ts) | [Editor Example](https://www.leaferjs.com/examples/#official%2Fplugin%2Feditor%2Fframe%2Ftransparent.ts)

## 💼 Commercial Support & Sustainability

There is a significant gap between “an engine” and “a mature product.” To ensure long-term maintenance of the open-source engine and help enterprises overcome complex development challenges, we’ve built a transparent and sustainable ecosystem:

- **LeaferJS is Permanently Open Source (MIT):** The core features and essential plugins will always remain open source and freely available, meeting the needs of the vast majority of projects. Developers can rely on a secure, controllable, and sustainable technology choice without worrying that core capabilities will become commercially restricted.
- **PxGrow Provides Optional Commercial Plugins:** Focused on solving complex challenges in **industrial-grade applications**, PxGrow offers professional editor suites, advanced graphics algorithms, and performance optimization capabilities, helping enterprises save months or even years of development time.
- **A Virtuous Cycle with a Long-Term Vision:** Developers benefit from open source, enterprises gain efficiency through commercial capabilities, and commercial support continuously drives the growth and innovation of LeaferJS—creating an open, transparent, and sustainable ecosystem.

### LeaferJS Repository Overview

| Repository    | Description                      | Link                                            |
| :------------ | :------------------------------- | :---------------------------------------------- |
| **LeaferJS**  | Main integration repo (runnable) | [GitHub](https://github.com/leaferjs/LeaferJS)  |
| **leafer**    | Core engine                      | [GitHub](https://github.com/leaferjs/leafer)    |
| **leafer-ui** | UI layer                         | [GitHub](https://github.com/leaferjs/leafer-ui) |
| **leafer-in** | Official plugins                 | [GitHub](https://github.com/leaferjs/leafer-in) |
| **leafer-x**  | Community plugins showcase       | [GitHub](https://github.com/leaferjs/leafer-x)  |
| **test**      | Automated testing                | [GitHub](https://github.com/leaferjs/test)      |
| **code**      | Example code                     | [GitHub](https://github.com/leaferjs/code)      |
| **docs**      | Documentation                    | [GitHub](https://github.com/leaferjs/docs)      |

## 🌟 Contribute: Five Years of Craftsmanship, Built from Passion

LeaferJS is an original open-source engine refined over five years. Our mission is to standardize the **graphics system foundation**, so developers can focus on creativity rather than low-level implementation.

**If you value originality and extreme performance, please give us a Star!**

<div style="display:flex; gap: 12px">
<a target="_blank" href="https://github.com/leaferjs/leafer-ui" aria-label="github"  rel="noopener">
  <img width="120" title="github" src="https://img.shields.io/github/stars/leaferjs/ui?style=social" />
</a>
</div>

- 🌟 **Star the repo:** Your support means everything.
- 🐞 **Report issues:** Every issue helps us improve.
- 🤝 **Join the community:** Explore the limits of Web graphics together.

## Contribution Guide

When you use LeaferJS, you become part of this vibrant community — stepping into a growing “tech castle.” Only through collective participation can it truly flourish.

[Code of Conduct](./contributor/CODE_OF_CONDUCT.md)

[Commit Convention](./contributor/COMMIT_CONVENTION.md)

[How to Ask Questions the Smart Way](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way/blob/main/README-zh_CN.md#%E6%8F%90%E9%97%AE%E7%9A%84%E6%99%BA%E6%85%A7)

## Thanks to Our Contributors

[Every creator who has participated in the Open Source Forest](https://www.leafer.pro/#creator)

[Every community member who has contributed code](https://github.com/leaferjs/leafer-ui/graphs/contributors)

[Early community members who helped build the ecosystem](https://www.leaferjs.com/ui/contribute/)

## Thanks to Our Sponsors

[Every user who has supported us through sponsorship](https://www.leaferjs.com/#footer-sponsor)

## License

MIT License — free to use, including for commercial applications.

Copyright © 2023-present Chao (Leafer) Wan
