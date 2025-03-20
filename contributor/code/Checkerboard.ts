// #自定义方格背景作为透明图片背景 [棋盘格] (https://shenzilong.cn/index/leaferjs/%E5%A6%82%E4%BD%95%E7%BB%98%E5%88%B6%E9%80%8F%E6%98%8E%E8%83%8C%E6%99%AF-%E6%B7%B1%E6%B5%85%E7%9B%B8%E9%97%B4%E7%9A%84%E6%96%B9%E6%A0%BC.html#20250319220001-bacxpac)
// @崮生-子虚 (https://shenzilong.cn/)
import { Leafer, Rect,  registerUI,Platform,type IUIInputData ,type ILeaferCanvas,type IRenderOptions} from 'leafer-ui'

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
);

@registerUI()  // 1. 注册元素
class Custom extends Rect {
    constructor(input: IUIInputData) {
        if (!input.fill) {
            input.fill = {
                type: 'image',
                url: svg,
                mode: 'repeat',
                format: 'svg',
                size: { height: 100, width: 100 },
            };
        }
        super(input);
    }
    public get __tag() { return 'Custom' } // 2. 定义全局唯一的 tag 名称

    // 绘制自定义内容 https://www.leaferjs.com/ui/reference/display/custom/context.html
    __draw(canvas: ILeaferCanvas, options: IRenderOptions): void {
        // 下面的代码用于在编辑器等场景实现自动缩放方格，使得无论视图怎么变，方格大小看起来始终差不多
        const scale = this.zoomLayer.scaleX ?? 1;
        const l = 100 / scale;
        // 修改第二层级的数据不会触发渲染, 例如 this.fill.size.height = 100 / scale; 不会触发渲染,所以这里需要重新赋值 fill 属性
        // 修改对象  https://www.leaferjs.com/ui/guide/basic/style.html#%E4%BF%AE%E6%94%B9%E5%AF%B9%E8%B1%A1
        this.fill = {
            type: 'image',
            url: svg,
            mode: 'repeat', // 相当于 CSS 的 background-repeat: repeat
            format: 'svg',
            size: { height: l, width: l },
        };
        super.__draw(canvas, options); // 调用父类的绘制方法，确保其他样式正常渲染
    }
}


const leafer = new Leafer({ view: window })
const background = new Custom({ width: 1000, height: 1000})

leafer.add(background)