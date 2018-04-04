<template>
  <div ref="danmaku" class="danmaku">
    <div class="chennel-info">
      <div v-for="(item, i) in chennelList" :key="i">
        <p>chennel{{i}}: {{item.isBusy}}</p>
        <p v-for="m in item.children" :key="m.text">{{m.left}}</p>
      </div>
    </div>
    <canvas ref="canvas"></canvas>
    <!-- <div class="danmaku-message">hello danmu</div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      chennelList: []
    }
  },
  mounted() {
    this.init()
    
    let i = 0
    let timer = setInterval(() => {
      i += 1
      if (i > 100) clearInterval(timer)
      let message = this.generate({text: `第 ${i} 条弹幕`})
      this.pushMessageToChennel(message)
    }, 100)
    this.loop()
  },
  methods: {
    init() {
      let $canvas = this.$refs.canvas
      $canvas.width = window.innerWidth
      $canvas.height = window.innerHeight
      this.ctx = $canvas.getContext('2d')
      this.$canvas = $canvas
      this.spliteChennel()
    },
    loop() {
      requestAnimationFrame(() => {
        // 清空画布
        this.clear()
        // 重新布局
        this.reflow()
        // 绘制
        this.draw()
        // 循环执行
        this.loop()
      })
    },
    // 清空画布
    clear() {
      this.ctx.clearRect(0, 0, this.$canvas.width, this.$canvas.height)
    },
    reflow() {
      let width = this.$canvas.width
      this.chennelList.forEach(chennel => {
        for (let j = 0; j < chennel.children.length; j++) {
          let message = chennel.children[j]
          message.left -= 5
          if (message.left + message.width < 0) {
            chennel.children.splice(j, 1)
            j -= 1
          }
        }
        if (chennel.children.length > 0) {
          chennel.isBusy = chennel.children.some(message => {
            return message.left + message.width + 100 > width
          })
        } else {
          chennel.isBusy = false
        }
      })
    },
    generate({text = 'hello', color = this.getRandomColor()}) {
      let ctx = this.ctx
      let fontSize = this.getRandom(16, 38)
      let font = `${fontSize}px Microsof Yahei`
      ctx.font = font
      let width = ctx.measureText(text).width
      return {
        left: this.$canvas.width - 0,
        text,
        color,
        font,
        fontSize,
        width
      }
    },
    draw(message) {
      let ctx = this.ctx
      this.chennelList.forEach(chennel => {
        chennel.children.forEach(message => {
          ctx.font = message.font
          ctx.fillStyle = message.color
          ctx.fillText(message.text, message.left, chennel.top)
        })
      })
    },
    // 生成弹幕通道
    spliteChennel() {
      let count = ~~(this.$canvas.height / 100)
      for (let i = 0; i < count; i++) {
        this.chennelList.push({
          top: (i + 1) * 100,
          isBusy: false,
          children: []
        })
      }
    },
    // 把弹幕塞到不繁忙的通道里
    pushMessageToChennel(message) {
      let chennel = this.chennelList.find(item => !item.isBusy)
      if (chennel) {
        chennel.children.push({
          ...message
        })
        chennel.isBusy = true
        return true
      } else {
        return false
      }
    },
    getRandomColor() {
      let colors = ['rgb(4, 174, 245)', 'rgb(255, 180, 0)', 'rgb(255, 255, 255)']
      // let [c1, c2] = [this.getRandom(), this.getRandom()]
      // let c1 = this.getRandom(200, 255)
      // let c2 = this.getRandom(100, 255)
      // let colors = [0, c1, c2].sort(() => 0.5 - Math.random())
      // let [r, g, b] = colors
      // return `rgb(${r}, ${g}, ${b})`
      return colors[this.getRandom(0, colors.length)]
    },
    getRandom(min = 0, max = 255) {
      return ~~(Math.random() * (max - min) + min)
    }
  }
}
</script>

<style lang="less">
.danmaku {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: #fff;
  background-color: rgba(0, 0, 0, .5);
  font-size: 20px;
  z-index: 10;
  position: fixed;
  visibility: visible;
  .danmaku-message {
    left: 0;
    position: absolute;
    transform: translateX(-100%);
    animation: message 10s linear 1s;
  }
  .chennel-info {
    top: 0;
    left: 0;
    position: absolute;
  }
  @keyframes message {
    0% {
      left: 100%;
      transform: translateX(0);
    }
    100% {
      left: 0;
      transform: translateX(-100%);
    }
  }
}
</style>
