<template>
  <div ref="danmaku" class="danmaku" :class="{show: show}">
    <div class="danmaku-btn-close" @click="close">
      <i class="iconfont icon-close"></i>
    </div>
    <div class="chennel-info">
      <div v-for="(item, i) in chennelList" :key="i">
        <p>chennel{{i}}: {{item.isBusy}}</p>
        <!-- <p v-for="m in item.children" :key="m.text">{{m.left}}</p> -->
      </div>
      <div v-for="(item) in messageList" :key="item.id">{{item.text}}</div>
    </div>
    <canvas ref="canvas"></canvas>
    <!-- <div class="danmaku-message">hello danmu</div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      chennelList: [], // 通道
      messageList: [] // 弹幕池
    }
  },
  mounted() {
    this.$bus.$on('danmaku', this.getDanmakuData)
    this.init()
  },
  methods: {
    // 初始化
    init() {
      let $canvas = this.$refs.canvas
      $canvas.width = window.innerWidth
      $canvas.height = window.innerHeight
      this.ctx = $canvas.getContext('2d')
      this.$canvas = $canvas
      // 切割通道
      this.spliteChennel()
      // 开始循环绘制弹幕
      this.loop()
    },
    // 循环动画
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
    // 获取弹幕数据
    getDanmakuData(id) {
      document.addEventListener('keydown', this.onDocumnetKeydown)
      this.show = true
      /* eslint-disable-next-line */
      let reg = /\[(.*)\]\((.*?)\)/g
      let param = {
        mdrender: false
      }
      setTimeout(() => {
        this.$ajaxGet(`/topic/${id}`, param).then(data => {
          data = data.data || {}
          let list = data.replies
          list.forEach(item => {
            let message = this.generate({text: item.content.replace(reg, ''), id: item.id})
            this.pushMessage(message)
          })
          this.nextMessage()
        })
      }, 500)
    },
    // 回流
    reflow() {
      let width = this.$canvas.width
      this.chennelList.forEach(chennel => {
        for (let j = 0; j < chennel.children.length; j++) {
          let message = chennel.children[j]
          if (message.left > width * 2 / 3) {
            message.left -= 50
          } else if (message.left < width / 8) {
            message.left -= 50
          } else {
            message.left -= 5
          }
          if (message.left + message.width < 0) {
            chennel.children.splice(j, 1)
            j -= 1
          }
        }
        // 整理空闲通道和繁忙通道
        if (chennel.children.length > 0) {
          chennel.isBusy = chennel.children.some(message => {
            return message.left + message.width + 100 > width * 2 / 3
          })
        } else {
          chennel.isBusy = false
        }
      })
    },
    // 生成一条 message
    generate({text = 'hello', color = this.getRandomColor(), id = Math.random()}) {
      let ctx = this.ctx
      let fontSize = this.getRandom(20, 45)
      let font = `${fontSize}px Microsof Yahei`
      ctx.font = font
      let width = ctx.measureText(text).width
      return {
        id,
        left: this.$canvas.width - 0,
        text,
        color,
        font,
        fontSize,
        width
      }
    },
    // 画
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
    close() {
      this.messageList.length = 0
      this.show = false
      this.chennelList.forEach(chennel => chennel.children.length = 0)
      document.removeEventListener('keydown', this.onDocumnetKeydown)
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
    nextMessage() {
      setTimeout(() => {
        if (this.messageList.length && this.show) {
          let message = this.messageList.shift()
          this.getNotBusyChennel().then(chennel => {
            chennel.children.push({
              ...message
            })
            chennel.isBusy = true
            this.nextMessage()
          })
        }
      }, 100)
    },
    pushMessage(message) {
      this.messageList.push(message)
    },
    // 获取可用的通道
    getNotBusyChennel() {
      return new Promise(resolve => {
        let chennelTimer = setInterval(() => {
          let chennelList = this.chennelList.filter(item => !item.isBusy)
          let chennel = chennelList[this.getRandom(0, chennelList.length - 1)]
          if (chennel) {
            clearInterval(chennelTimer)
            resolve(chennel)
          }
        }, 100)
      })
    },
    // 把弹幕塞到不繁忙的通道里
    pushMessageToChennel(message) {
      let chennelList = this.chennelList.filter(item => !item.isBusy)
      let chennel = chennelList[this.getRandom(0, chennelList.length - 1)]
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
    onDocumnetKeydown(e) {
      let code = e.keyCode
      if (code === 27) this.close()
    },
    getRandomColor() {
      let colors = ['#0ff', '#0fc', '#0c3', '#3ff', '#3f6', '#6cf', '#99f', '#c03', '#f06', '#cf0', '#f33', '#ff3']
      return colors[this.getRandom(0, colors.length)]
      // let c1 = this.getRandom(200, 255)
      // let c2 = this.getRandom(100, 255)
      // let colors = [0, c1, c2].sort(() => 0.5 - Math.random())
      // let [r, g, b] = colors
      // return `rgb(${r}, ${g}, ${b})`
    },
    getRandom(min = 0, max = 255) {
      return ~~(Math.random() * (max - min) + min)
    }
  }
}
</script>

<style lang="less">
.danmaku {
  top: 100%;
  left: 0;
  width: 100%;
  height: 100%;
  color: #fff;
  background-color: rgba(0, 0, 0, .5);
  font-size: 20px;
  z-index: 10;
  position: fixed;
  visibility: visible;
  transition: top 300ms linear;
  &.show {
    top: 0;
  }
  .danmaku-btn-close {
    top: 0;
    right: 0;
    width: 70px;
    height: 70px;
    line-height: 1;
    color: #000;
    background-color: #ddd;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    i {
      font-size: 30px;
    }
    &:hover {
      background-color: #fff;
    }
  }
  .danmaku-message {
    left: 0;
    position: absolute;
    transform: translateX(-100%);
    animation: message 10s linear 1s;
  }
  .chennel-info {
    top: 0;
    left: 0;
    opacity: .5;
    // display: none;
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
