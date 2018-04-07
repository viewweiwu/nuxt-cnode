<template>
  <div class="topics-detail">
    <Ctrl></Ctrl>
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
          <div class="detail-content markdown-text" v-html="detail.content"></div>
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
          <div class="detail-content markdown-text" v-html="item.content"></div>
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
              <li class="detail-btn-reply" @click="reply(item)">回复</li>
            </ul>
          </div>
          <div class="reply-list" v-if="item.children.length || item.reply">
            <div class="reply-item" v-for="reply in item.children" :key="reply.id">
              <div class="reply-avatar">
                <img :src="reply.author.avatar_url" alt="">
              </div>
              <div class="reply-item-content" v-html="reply.content"></div>
              <div class="detail-info reply-item-info">
                <ul>
                  <li class="detail-up" @click="onUps(reply)">
                    <span class="detail-action" :class="{active: reply.action === 'up'}">+1</span>
                    <span class="detail-action red" :class="{active: reply.action === 'down'}">-1</span>
                    <span class="detail-up-icon">👍</span>
                    <span>{{reply.ups.length}}</span>
                  </li>
                  <li>{{reply.create_at | moment('calendar')}}</li>
                </ul>
              </div>
            </div>
            <div class="reply-item-main" v-if="item.reply">
              <textarea placeholder="请不要再这里输入 md 格式文本" v-model="item.replyContent"></textarea>
              <button class="reply-btn-submit" @click="submit(item)">发表</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="detail-reply">
      <p class="reply-title">
        发表回复
      </p>
      <div class="reply-main">
        <textarea
          placeholder="这里支持 md 格式的文本"
          class="reply-content"
          contenteditable="true"
          @keydown="onContentKeydown"
          v-model="replyContent">
        </textarea>
        <div class="reply-view markdown-text" v-html="contentMD"></div>
      </div>
      <button class="reply-btn-submit markdown-text" @click="submit">发表</button>
    </div>
  </div>
</template>

<script>
import { ajaxGet } from '~/plugins/util'
import hljs from 'highlight.js'
import marked from 'marked'
import 'highlight.js/styles/ocean.css'
import Ctrl from '~/components/topics/ctrl'

const getData = (id, self) => {
  let param = {
    mdrender: false
  }
  return ajaxGet(`/topic/${id}`, param)
}

export default {
  components: {
    Ctrl
  },
  data() {
    return {
      id: this.$route.params.id,
      replyContent: ''
    }
  },
  async asyncData(route) {
    let data = await getData(route.params.id)
    data = data.data || {}
    let detail = {
      id: data.id,
      author_id: data.author_id,
      tab: data.tab,
      title: data.title,
      content: marked(data.content),
      last_reply_at: data.last_reply_at,
      good: data.good,
      top: data.top,
      create_at: data.create_at,
      reply_count: data.reply_count,
      visit_count: data.visit_count,
      author: data.author
    }
    let replies = (data.replies || []).map(item => {
      return {
        ...item,
        content: marked(item.content),
        action: '',
        reply: false,
        replyContent: '',
        children: []
      }
    })
    // 如果有回复的 id 就添加到子项
    for (let i = 0; i < replies.length; i++) {
      let reply = replies[i]
      if (reply.reply_id) {
        let target = replies.find(item => item.id === reply.reply_id)
        if (target) {
          target.children.push(reply)
          replies.splice(i, 1)
          i -= 1
        }
      }
    }
    return {
      detail,
      replies
    }
  },
  mounted() {
    this.highlight()
  },
  computed: {
    contentMD() {
      return marked(this.replyContent)
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
    },
    highlight() {
      let $codeList = document.querySelectorAll('pre code')
      $codeList.forEach($code => {
        hljs.highlightBlock($code)
      })
      let $linkList = document.querySelectorAll('.markdown-text a')
      $linkList.forEach($link => {
        $link.setAttribute('target', '_blank')
      })
    },
    onContentKeydown(e) {
      if (e.keyCode === 9) {
        e.preventDefault()
        e.stopPropagation()
        let $target = e.target
        let value = e.target.value
        let start = $target.selectionStart
        let end = $target.selectionEnd
        value = value.slice(0, start) + '  ' + value.slice(end)
        this.replyContent = value
        this.$nextTick(() => {
          $target.setSelectionRange(end + 2, end + 2)
        })
      } else if (e.keyCode === 13 && e.ctrlKey) {
        this.submit()
      }
    },
    submit(item) {
      if (!this.replyContent.trim() && !item) {
        alert('请输入回复内容')
        return
      } else if (item && !item.replyContent.trim()) {
        alert('请输入回复内容')
        return
      }

      let param = {
        accesstoken: 'dcba818a-8b57-4f25-8fa5-2c66dc28c2ba',
        content: this.replyContent
      }
      if (item) {
        param.content = item.replyContent
        param.reply_id = item.id
      }
      this.$ajaxPost(`/topic/${this.id}/replies`, param).then(data => {
        if (item) {
          item.reply = false
          item.replyContent = ''
        }
        alert('成功')
      })
    },
    reply(item) {
      item.reply = !item.reply
      item.replyContent = item.reply ? '@' + item.author.loginname + ' ' : ''
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
  position: relative;
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
    padding: 10px;
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
    margin-right: 20px;
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
    color: #0da5a2;
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
  .detail-reply {
    width: 1080px;
    padding: 20px 50px;
    border: 1px solid #ddd;
    border-top: none;
    background-color: #eee;
  }
  .reply-main {
    margin: 10px;
    display: flex;
  }
  .reply-content {
    width: 50%;
    height: 250px;
    padding: 10px;
    border: 1px solid #ccc;
    background-color: #fff;
  }
  .reply-view {
    width: 50%;
    height: 250px;
    border: 1px solid #ccc;
    padding: 10px;
    border-left: none;
    background-color: #fff;
    float: right;
    overflow: auto;
  }
  .reply-btn-submit {
    border: 1px solid #58f;
    margin-top: 10px;
    margin-left: 10px;
    border-radius: 3px;
    padding: 5px 10px;
    color: #fff;
    background-color: #58f;
  }
  .detail-btn-reply {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
  .reply-member {
    color: #0da5a2;
  }
  .reply-list {
    margin-left: 50px;
    padding: 10px;
    border: 1px solid #eee;
    background-color: #f7f8fa;
    a {
      color:#0da5a2;
    }
  }
  .reply-item {
    padding: 10px;
  }
  .reply-avatar {
    width: 40px;
    height: 40px;
    padding: 2px;
    border: 1px solid #ccc;
    float: left;
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .reply-item-content {
    margin-left: 45px;
  }
  .reply-item + .reply-item {
    border-top: 1px dotted #ddd;
  }
  .reply-item-info {
    height: 20px;
    margin: 0;
    color: #999;
    text-align: right;
  }
  .reply-item-main {
    padding: 0 20px;
    margin-top: 10px;
    width: 100%;
    display: block;
    textarea {
      width: 100%;
      height: 100%;
      padding: 5px;
    }
  }
}
</style>
