/**
 * 动态 canvas 背景
 * Animated Canvas Background
 * @author: KyleBing(kylebing@163.com)
 * @github: https://github.com/KyleBing/animate-canvas-bg
 * @date-init: 2023-02-11
 * @date-update: 2023-02-11
 * @version: v0.1
 *
 */

let configFrame = {
    width : 1600,
    height: 1000,
}
let configBox = {
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

let configGradient = {
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

let boxBuffer = []

window.onload = () => {
    configFrame.height = innerHeight * 2
    configFrame.width = innerWidth * 2
    init()
}

window.onresize = () => {
    configFrame.height = innerHeight * 2
    configFrame.width = innerWidth * 2
    let gradientLayer = document.getElementById('gradientLayer')
    let boxLayer = document.getElementById('boxLayer')
    updateFrameAttribute(gradientLayer, boxLayer)
}

function updateFrameAttribute(gradientLayer, boxLayer){
    gradientLayer.setAttribute('id', 'gradientLayer')
    gradientLayer.setAttribute('width', configFrame.width)
    gradientLayer.setAttribute('height', configFrame.height)
    gradientLayer.style.width = `${configFrame.width / 2}px`
    gradientLayer.style.height = `${configFrame.height / 2}px`
    gradientLayer.style.zIndex = '-3'
    gradientLayer.style.userSelect = 'none'
    gradientLayer.style.position = 'fixed'
    gradientLayer.style.top = '0'
    gradientLayer.style.left = '0'

    boxLayer.setAttribute('id', 'boxLayer')
    boxLayer.setAttribute('width', configFrame.width)
    boxLayer.setAttribute('height', configFrame.height)
    boxLayer.style.width = `${configFrame.width / 2}px`
    boxLayer.style.height = `${configFrame.height / 2}px`
    boxLayer.style.zIndex = '-2'
    boxLayer.style.userSelect = 'none'
    boxLayer.style.position = 'fixed'
    boxLayer.style.top = '0'
    boxLayer.style.left = '0'
}

function init(){

    let gradientLayer = document.createElement("canvas")
    let boxLayer = document.createElement("canvas")
    updateFrameAttribute(gradientLayer, boxLayer)
    document.documentElement.append(gradientLayer, boxLayer)

    configGradient.h = randomFloat(configGradient.hMin, configGradient.hMax)

    // CREATE BOXES
    boxBuffer = []
    for (let i = 0; i < configBox.boxCount; i++) {
        boxBuffer.push({
            name: i,
            color: randomOpacity(configBox.opacityMin, configBox.opacityMax),
            // color: `hsl(0 0% 100% / ${randomOpacity()})`,
            // color: randomColor(configBox.colorHMin, configBox.colorHMax, configBox.opacityMin, configBox.opacityMax), // 带颜色的随机颜色
            speedX: randomSpeed().speedX,
            speedY: randomSpeed().speedY,
            directionX: randomDirection(),
            directionY: randomDirection(),
            boxSize: randomBoxSize(configBox.boxSizeMin,configBox.boxSizeMax), // 方块大小
            position: randomPosition(configFrame) // 位置
        })
    }
    draw()
}


function draw() {
    // gradient
    let contextGradient = document.getElementById('gradientLayer').getContext('2d')
    contextGradient.clearRect(0, 0, configFrame.width, configFrame.height)

    configGradient.h = configGradient.h + configGradient.speed * configGradient.hColorDirection

    if (configGradient.h > configGradient.hMax) configGradient.hColorDirection = -1
    if (configGradient.h < configGradient.hMin) configGradient.hColorDirection = +1


    // let gradient = contextGradient.createConicGradient(0, configFrame.width / 2, configFrame.height / 2)
    let gradient = contextGradient.createLinearGradient(0, 0, configFrame.width, configFrame.height)
    // let gradient = contextGradient.createRadialGradient(configFrame.width/2, configFrame.height/2, 500, configFrame.width/2, configFrame.height/2, 800)
    gradient.addColorStop(0, `hsl(${configGradient.h}, ${configGradient.s}%, ${configGradient.l}%)`)
    gradient.addColorStop(1, `hsl(${configGradient.h + configGradient.gap}, ${configGradient.s}%, ${configGradient.l}%)`)
    contextGradient.fillStyle = gradient
    contextGradient.fillRect(0, 0, configFrame.width, configFrame.height)


    // create boxes
    let context = document.getElementById('boxLayer').getContext('2d')
    context.clearRect(0, 0, configFrame.width, configFrame.height)

    boxBuffer.forEach(box => {
        if (box.position.x > configFrame.width - box.boxSize.width) box.directionX = -1
        if (box.position.y > configFrame.height - box.boxSize.height)box.directionY = -1
        if (box.position.x < 0) box.directionX = 1
        if (box.position.y < 0) box.directionY = 1

        box.position.x = box.position.x + box.speedX * box.directionX
        box.position.y = box.position.y + box.speedY * box.directionY

        context.fillRect(box.position.x, box.position.y, box.boxSize.width, box.boxSize.height)
        context.fillStyle = box.color
        context.fill()
    })

    window.requestAnimationFrame(draw)
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
function randomSpeed(){
    let randomX = Math.random() * (configBox.speedMax - configBox.speedMin) + configBox.speedMin
    let randomY = Math.random() * (configBox.speedMax - configBox.speedMin) + configBox.speedMin
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
