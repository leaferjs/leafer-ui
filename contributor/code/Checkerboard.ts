// #自定义方格背景作为透明图片背景 [棋盘格] (https://shenzilong.cn/index/leaferjs/%E5%A6%82%E4%BD%95%E7%BB%98%E5%88%B6%E9%80%8F%E6%98%8E%E8%83%8C%E6%99%AF-%E6%B7%B1%E6%B5%85%E7%9B%B8%E9%97%B4%E7%9A%84%E6%96%B9%E6%A0%BC.html#20250319220001-bacxpac)
// @崮生-子虚 (https://shenzilong.cn/)
import { App, Rect, ResizeEvent, Platform } from 'leafer-ui'
import '@leafer-in/editor' // 导入图形编辑器插件
import '@leafer-in/viewport' // 导入视口插件 (可选)

// 创建一个用于平铺的方格图片
const svg = Platform.toURL(
    `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
<!-- 定义两个不同颜色的方块 -->
<defs>
<pattern id="checkerboard" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
<!-- 浅色方块 -->
<rect x="0" y="0" width="10" height="10" fill="#cccccc"/>
<rect x="10" y="10" width="10" height="10" fill="#cccccc"/>
<!-- 深色方块 -->
<rect x="10" y="0" width="10" height="10" fill="#999999"/>
<rect x="0" y="10" width="10" height="10" fill="#999999"/>
</pattern>
</defs>
<!-- 使用定义的图案填充整个SVG -->
<rect x="0" y="0" width="100" height="100" fill="url(#checkerboard)"/>
</svg>`,
    'svg',
)

const app = new App({ view: window, ground: {}, editor: {} })

// 添加方格背景层
const background = Rect.one({ hittable: false, fill: { type: 'image', url: svg, mode: 'repeat' } })
app.ground.add(background)

// resize
function resize() {
    background.width = app.width
    background.height = app.height
}

app.on(ResizeEvent.RESIZE, resize)
resize()

// 添加编辑内容
app.tree.add(Rect.one({ editable: true, fill: '#FEB027', cornerRadius: [20, 0, 0, 20] }, 100, 100))
app.tree.add(Rect.one({ editable: true, fill: '#FFE04B', cornerRadius: [0, 20, 20, 0] }, 300, 100))