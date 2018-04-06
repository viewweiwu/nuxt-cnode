<template>
  <div class="topics-detail">
    <div class="detail-header">
      <h1 class="detail-title">{{detail.title}}</h1>
    </div>
    <div class="detail-list">
      <div class="detail-item">
        <div class="detail-user">
          <div class="user-top">楼主</div>
          <div class="user-avatar">
            <img :src="detail.author.avatar_url" alt="">
          </div>
          <p>{{detail.author.loginname}}</p>
        </div>
        <div class="detail-main">
          <div class="detail-content" v-html="detail.content"></div>
          <div class="detail-info">
            <ul>
              <li>1楼</li>
              <li>{{detail.create_at | moment('calendar')}}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="detail-item" v-for="(item, i) in replies" :key="item.id">
        <div class="detail-user">
          <div class="user-avatar">
            <img :src="item.author.avatar_url" alt="">
          </div>
          <p>{{item.author.loginname}}</p>
        </div>
        <div class="detail-main">
          <div class="detail-content" v-html="item.content"></div>
          <div class="detail-info">
            <ul>
              <li class="detail-up" @click="onUps(item)">
                <span class="detail-action" :class="{active: item.action === 'up'}">+1</span>
                <span class="detail-action red" :class="{active: item.action === 'down'}">-1</span>
                <span class="detail-up-icon">👍</span>
                <span>{{item.ups.length}}</span>
              </li>
              <li>{{i + 2}}楼</li>
              <li>{{item.create_at | moment('calendar')}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ajaxGet } from '~/plugins/util'

const getData = (id, self) => {
  return ajaxGet(`/topic/${id}`)
}

export default {
  data() {
    return {
      id: this.$route.query.id
    }
  },
  async asyncData(route) {
    let data = await getData(route.query.id)
    data = data.data || {}
    let detail = {
      id: data.id,
      author_id: data.author_id,
      tab: data.tab,
      title: data.title,
      content: data.content,
      last_reply_at: data.last_reply_at,
      good: data.good,
      top: data.top,
      create_at: data.create_at,
      reply_count: data.reply_count,
      visit_count: data.visit_count,
      author: data.author
    }
    return {
      detail,
      replies: (data.replies || []).map(item => {
        return {
          ...item,
          action: ''
        }
      })
    }
  },
  methods: {
    onUps(item) {
      let param = {
        accesstoken: 'dcba818a-8b57-4f25-8fa5-2c66dc28c2ba'
      }
      this.$ajaxPost(`/reply/${item.id}/ups`, param).then(data => {
        if (data.action === 'up') {
          item.ups.push('up')
        } else {
          item.ups.splice(item.ups.length - 1, 1)
        }
        item.action = data.action
      })
    }
  }
}
</script>

<style lang="less">
.topics-detail {
  width: 1080px;
  margin: 0 auto 50px;
  padding-top: 70px;
  background-color: #fff;
  .detail-header {
    top: 0;
    width: 1080px;
    height: 70px;
    line-height: 70px;
    border: 1px solid #ddd;
    border-top: none;
    border-bottom: 1px solid #bbb;
    background-color: #fff;
    z-index: 1;
    position: fixed;
  }
  .detail-title {
    height: 100%;
    margin-left: 20px;
    font-size: 16px;
    font-weight: 400;
  }
  .detail-list {
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
  }
  .detail-item {
    border-bottom: 1px solid #ddd;
    background-color: #fafbfc;
    overflow: hidden;
  }
  .detail-user {
    width: 200px;
    padding-bottom: 10px;
    overflow: hidden;
    text-align: center;
    float: left;
    position: relative;
  }
  .user-avatar {
    width: 150px;
    height: 150px;
    padding: 5px;
    margin: 20px auto;
    border: 1px solid #ddd;
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .user-top {
    top: -21px;
    right: -45px;
    width: 80px;
    height: 30px;
    line-height: 30px;
    position: absolute;
    color: #fff;
    background-color: #58f;
    transform-origin: top left;
    transform: rotate(45deg);
  }
  .detail-main {
    padding: 30px 30px 10px;
    margin-left: 200px;
    border-left: 1px solid #eee;
    background-color: #fff;
  }
  .detail-content {
    min-height: 350px;
  }
  .detail-info {
    height: 30px;
    margin-top: 10px;
    color: #777;
    ul {
      float: right;
    }
    li {
      float: left;
    }
    li + li {
      margin-left: 10px;
    }
  }
  .detail-up {
    user-select: none;
    cursor: pointer;
    position: relative;
  }
  .detail-up-icon {
    top: -1px;
    margin-right: 2zpx;
    position: relative;
  }
  .detail-action {
    bottom: 100%;
    right: 0;
    color: #005cff;
    display: none;
    position: absolute;
    &.red {
      color: #f06;
    }
    &.active {
      opacity: 0;
      display: inline-block;
      animation: up .5s;
    }
  }
  @keyframes up {
    0% {
      opacity: 1;
      transform: translateY(0)
    }
    100% {
      opacity: .5;
      transform: translateY(-100%)
    }
  }
}
</style>
