/**
 * 动态 canvas 背景
 * Animated Canvas Background
 * @author: KyleBing(kylebing@163.com)
 * @github: https://github.com/KyleBing/animate-canvas-bg
 * @date-init: 2023-02-11
 * @date-update: 2023-02-11
 * @version: v0.1.2
 * @platform: Browser
 */

class AnimatedCanvasBG {
    constructor() {
        this.isPlaying = true // 默认自动播放

        this.mouseX = 0
        this.mouseY = 0

        this.configFrame = {
            width : 1600,
            height: 1000,
        }
        this.configBox = {
            speedMin: 0.01, // 运动速度 0 ~
            speedMax: 0.3,

            directionX: 1, // 运动方向 +1 -1
            directionY: 1,

            boxCount: 100, // 方块数量

            boxSizeMin: 20, // 方块大小范围
            boxSizeMax: 200,

            opacityMin: 0.3, // 透明度范围 0-1
            opacityMax: 0.5,

            colorHMin: 160, // 颜色范围 hsl h取值
            colorHMax: 180
        }
        this.configGradient = {
            h: 0,    // 颜色   0-360
            s: 100,  // 饱和度 0-100
            l: 70,   // 亮度   0-100
            a: 1,    // 透明度 0-1

            hMin: 150,
            hMax: 160,
            hColorDirection: 1, // 颜色变化方向  +1 -1

            speed: 0.1, // 颜色变化速度
            gap: 60     // 渐变起点-终点的颜色跨度 0-255
        }

        this.boxBuffer = [] // 方块缓存

        this.configFrame.height = innerHeight * 2
        this.configFrame.width = innerWidth * 2
        this.init()


        window.onresize = () => {
            this.configFrame.height = innerHeight * 2
            this.configFrame.width = innerWidth * 2
            let gradientLayer = document.getElementById('gradientLayer')
            let boxLayer = document.getElementById('boxLayer')
            this.updateFrameAttribute(gradientLayer, boxLayer)
        }
    }

    play(){
        if (this.isPlaying){

        } else {
            this.isPlaying = true
            this.draw()
        }
    }
    stop(){
        this.isPlaying = false
    }

    speedUp(){}
    speedDown(){}

    destroy(){
        this.isPlaying = false
        let gradientLayer = document.getElementById('gradientLayer')
        let boxLayer = document.getElementById('boxLayer')
        gradientLayer.remove()
        boxLayer.remove()
        console.log('动画已停止')
    }


    updateFrameAttribute(gradientLayer, boxLayer){
        gradientLayer.setAttribute('id', 'gradientLayer')
        gradientLayer.setAttribute('width', this.configFrame.width)
        gradientLayer.setAttribute('height', this.configFrame.height)
        gradientLayer.style.width = `${this.configFrame.width / 2}px`
        gradientLayer.style.height = `${this.configFrame.height / 2}px`
        gradientLayer.style.zIndex = '-3'
        gradientLayer.style.userSelect = 'none'
        gradientLayer.style.position = 'fixed'
        gradientLayer.style.top = '0'
        gradientLayer.style.left = '0'

        boxLayer.setAttribute('id', 'boxLayer')
        boxLayer.setAttribute('width', this.configFrame.width)
        boxLayer.setAttribute('height', this.configFrame.height)
        boxLayer.style.width = `${this.configFrame.width / 2}px`
        boxLayer.style.height = `${this.configFrame.height / 2}px`
        boxLayer.style.zIndex = '-2'
        boxLayer.style.userSelect = 'none'
        boxLayer.style.position = 'fixed'
        boxLayer.style.top = '0'
        boxLayer.style.left = '0'
    }


    init(){
        let gradientLayer = document.createElement("canvas")
        let boxLayer = document.createElement("canvas")
        this.updateFrameAttribute(gradientLayer, boxLayer)
        document.documentElement.append(gradientLayer, boxLayer)

        this.configGradient.h = randomFloat(this.configGradient.hMin, this.configGradient.hMax)

        // CREATE BOXES
        this.boxBuffer = []
        for (let i = 0; i < this.configBox.boxCount; i++) {
            let tempBoxSize = randomBoxSize(this.configBox.boxSizeMin,this.configBox.boxSizeMax)
            let tempBoxSizeOrigin = {}
            Object.assign(tempBoxSizeOrigin, tempBoxSize) // 切断对象连接，使这两个参数为独立的参数

            this.boxBuffer.push({
                name: i,
                color: randomOpacity(this.configBox.opacityMin, this.configBox.opacityMax),
                // color: `hsl(0 0% 100% / ${randomOpacity()})`,
                // color: randomColor(this.configBox.colorHMin, this.configBox.colorHMax, this.configBox.opacityMin, this.configBox.opacityMax), // 带颜色的随机颜色
                speedX: randomSpeed(this.configBox.speedMin, this.configBox.speedMax).speedX,
                speedY: randomSpeed(this.configBox.speedMin, this.configBox.speedMax).speedY,
                directionX: randomDirection(),
                directionY: randomDirection(),
                boxSize: tempBoxSize, // 方块大小
                boxSizeOrigin: tempBoxSizeOrigin, // 方块大小，用于在变化后变回原来的大小
                position: randomPosition(this.configFrame) // 位置
            })
        }
        this.draw()


        document.documentElement.addEventListener('mousemove', event => {
            this.mouseX = event.x
            this.mouseY = event.y
        })
    }

    // 判断鼠标是否处于 box 上面
    isMouseIsOnBox(box){
        return (this.mouseX > box.position.x / 2) &&
            (this.mouseX < (box.position.x + box.boxSize.width) / 2) &&
            (this.mouseY > box.position.y / 2) &&
            (this.mouseY < (box.position.y + box.boxSize.height) / 2)
    }

    // 判断鼠标跟 box 的距离
    isMouseIsCloseToBox(box){
        let distance = Math.sqrt(Math.pow(Math.abs(box.position.x / 2 - this.mouseX),2) + Math.pow(Math.abs(box.position.y /2  - this.mouseY), 2))
        return distance < 100
    }

    draw() {

        let canvasGradient = document.getElementById('gradientLayer')
        if (!canvasGradient){
            return
        }
        // gradient
        let contextGradient = canvasGradient.getContext('2d')
        contextGradient.clearRect(0, 0, this.configFrame.width, this.configFrame.height)

        this.configGradient.h = this.configGradient.h + this.configGradient.speed * this.configGradient.hColorDirection

        if (this.configGradient.h > this.configGradient.hMax) this.configGradient.hColorDirection = -1
        if (this.configGradient.h < this.configGradient.hMin) this.configGradient.hColorDirection = +1


        // let gradient = contextGradient.createConicGradient(0, this.configFrame.width / 2, this.configFrame.height / 2)
        let gradient = contextGradient.createLinearGradient(0, 0, this.configFrame.width, this.configFrame.height)
        // let gradient = contextGradient.createRadialGradient(this.configFrame.width/2, this.configFrame.height/2, 500, this.configFrame.width/2, this.configFrame.height/2, 800)
        gradient.addColorStop(0, `hsl(${this.configGradient.h}, ${this.configGradient.s}%, ${this.configGradient.l}%)`)
        gradient.addColorStop(1, `hsl(${this.configGradient.h + this.configGradient.gap}, ${this.configGradient.s}%, ${this.configGradient.l}%)`)
        contextGradient.fillStyle = gradient
        contextGradient.fillRect(0, 0, this.configFrame.width, this.configFrame.height)


        // create boxes
        let canvasBoxes = document.getElementById('boxLayer')
        let contextBoxes = canvasBoxes.getContext('2d')
        contextBoxes.clearRect(0, 0, this.configFrame.width, this.configFrame.height)

        this.boxBuffer.forEach(box => {

            /*
            // 鼠标交互
            if (this.isMouseIsCloseToBox(box)){
            // if (this.isMouseIsOnBox(box)){
                box.boxSize.width = box.boxSize.width + 5
                box.boxSize.height = box.boxSize.height + 5
            } else {
                let tempBoxSizeOrigin = {}
                Object.assign(tempBoxSizeOrigin, box.boxSizeOrigin) // 切断对象连接，使这两个参数为独立的参数
                box.boxSize = tempBoxSizeOrigin
            }*/

            if (box.position.x > this.configFrame.width - box.boxSize.width) box.directionX = -1
            if (box.position.y > this.configFrame.height - box.boxSize.height)box.directionY = -1
            if (box.position.x < 0) box.directionX = 1
            if (box.position.y < 0) box.directionY = 1

            box.position.x = box.position.x + box.speedX * box.directionX
            box.position.y = box.position.y + box.speedY * box.directionY

            contextBoxes.fillRect(box.position.x, box.position.y, box.boxSize.width, box.boxSize.height)
            contextBoxes.fillStyle = box.color
            contextBoxes.fill()
        })

        if(this.isPlaying){
            window.requestAnimationFrame(()=> {
                this.draw()
            })
        }

    }
}



/**
 * 生成随机 box 大小
 * @param min
 * @param max
 * @returns {{frameWidth: *, frameHeight: *}}
 */
function randomBoxSize(min, max){
    let random = randomFloat(min, max)
    return {
        width: random,
        height: random
    }
}
/**
 * 随机位置
 * @param configFrame
 * @returns {{x: *, y: *}}
 */
function randomPosition(configFrame){
    let randomX = Math.random() * configFrame.width
    let randomY = Math.random() * configFrame.height
    return {
        x: randomX,
        y: randomY
    }
}

/**
 * 输出随机 1 或 -1
 * @returns {number}
 */
function randomDirection(){
    let random = Math.random()
    if (random > 0.5){
        return 1
    } else {
        return -1
    }
}
/**
 * 输出速度值
 */
function randomSpeed(speedMin, speedMax){
    let randomX = Math.random() * (speedMax - speedMin) + speedMin
    let randomY = Math.random() * (speedMax - speedMin) + speedMin
    return {
        speedX: randomX,
        speedY: randomY
    }
}

/**
 * 随机颜色值
 * @returns string
 */
function randomColor(hMin, hMax, opacityMin, opacityMax){
    let randomH = randomInt(hMin, hMax)
    let randomOpacity = randomFloat(opacityMin, opacityMax)
    return `hsl(${randomH}, 100%, 50%, ${randomOpacity})`
}

/**
 * 随机透明度
 * @returns {string}
 */
function randomOpacity(minOpacity, maxOpacity){
    let randomOpacity = Math.random() * (maxOpacity - minOpacity) + minOpacity
    let randomOpacityString = `${(randomOpacity * 100).toFixed(2)}%`
    return `hsl(0 0% 100% / ${randomOpacityString})`
}

/**
 * 生成随机整数
 * @param min
 * @param max
 * @returns {number}
 */
function randomInt(min, max){
    return Number((Math.random() * (max - min) + min).toFixed(0))
}

/**
 * 生成随机整数
 * @param min
 * @param max
 * @returns {number}
 */
function randomFloat(min, max){
    return Number(Math.random() * (max - min) + min)
}
