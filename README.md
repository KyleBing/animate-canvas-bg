# animate-bg-canvas

![2023-02-15 09 28 25](https://user-images.githubusercontent.com/12215982/218902518-8d78f061-98a2-491c-9136-80706fb01598.png)



## 使用说明

### 1. 浏览器
```js
// 新建对象时，会自动呈现动画效果
let animateCanvas = new AnimatedCanvasBG()

// 其它操作
animateCanvas.play()  // 方块动起来
animateCanvas.stop()  // 方块不动

```

### 2. Vue

```js
import { AnimatedCanvasBG } from "animate-bg-canvas"

export default {
    mounted() {
        this.height = innerHeight
        this.animatedBg = new AnimatedCanvasBG()
    },
    beforeDestroy() {
        this.animatedBg.destroy()
    }
}
```

## log
- 2023-02-14 v0.1
