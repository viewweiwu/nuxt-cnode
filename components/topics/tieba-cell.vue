<template>
  <div class="tieba-cell">
    <div class="reply-count">{{cell.reply_count}}</div>
    <div class="cell-message">
      <div class="cell-title">
        <button class="btn-danmaku" @click="showDanmaku(cell)">弹幕</button>
        <nuxt-link class="link" target="_blank" :to="`/topics/${cell.id}`">{{cell.title}}</nuxt-link>
      </div>
      <div class="cell-content" v-if="cell.content">{{cell.content}}</div>
      <div class="cell-img-list">
        <div class="cell-img-total" v-if="cell.imgList.length">共 {{cell.imgList.length}} 张</div>
        <div
          class="cell-img-item"
          v-for="(item, i) in cell.imgList"
          :key="i"
          v-if="i < 3"
          @click="showLargeImg(item)">
          <img :src="item" alt="">
        </div>
      </div>
      <div class="target-img" @click="targetImg = ''">
        <img v-if="targetImg" :src="targetImg" alt="">
      </div>
    </div>
    <div class="cell-info">
      <p>{{cell.author.loginname}}</p>
      <p class="cell-time">{{cell.last_reply_at | moment('calendar')}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cell: {
      type: Object,
      default: () => { return {} }
    },
    greet: {
      type: String,
      default: 'hello'
    }
  },
  data() {
    return {
      targetImg: ''
    }
  },
  methods: {
    showLargeImg(img) {
      this.targetImg = img
    },
    showDanmaku(cell) {
      this.$bus.$emit('danmaku', cell.id)
    }
  }
}
</script>

<style lang="less">
.tieba-cell {
  padding: 10px 20px;
  border-bottom: 1px dotted #e4e6eb;
  display: flex;
  position: relative;
  &:hover {
    background-color: #f7f9fc;
  }
  &:first-child {
    border-top: 1px dotted #e4e6eb;
  }
  .reply-count {
    width: 50px;
    height: 25px;
    margin-right: 20px;
    border: 1px solid #ddd;
    background-color: #f7f7f7;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .cell-message {
    width: 50%;
    flex: 1;
  }
  .cell-title {
    width: 100%;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .link {
    color: #2d64b3;
    &:visited {
      color: #653096;
    }
  }
  .cell-content {
    margin-top: 10px;
    color: #666;
  }
  .cell-info {
    width: 150px;
    margin-left: 10px;
    color: #999;
  }
  .cell-time {
    margin-top: 10px;
  }
  .cell-img-list {
    padding: 10px;
    position: relative;
    overflow: hidden;
    .cell-img-item {
      height: 120px;
      margin: 10px;
      background-color: #ddd;
      float: left;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: zoom-in;
    }
    img {
      max-height: 100%;
    }
  }
  .target-img {
    width: 100%;
    cursor: zoom-out;
    img {
      max-width: 100%;
    }
  }
  .cell-img-total {
    top: 0;
    left: 0;
    padding: 5px 10px;
    color: #fff;
    background-color: rgba(0, 0, 0, .7);
    position: absolute;
  }
  .btn-danmaku {
    top: 0;
    left: 0;

    cursor: pointer;
  }
}
</style>
