<template>
  <div class="topics">
    <Danmaku></Danmaku>
    <Banner></Banner>
    <div class="topics-nav">
      <nuxt-link
        v-for="item in navList"
        class="topics-nav-link"
        :key="item.text"
        :to="item.link"
        :class="{'active': item.tab === tab}"
      >
        {{item.text}}
      </nuxt-link>
    </div>
    <div class="topics-content">
      <div class="topics-main">
        <pager class="topics-papge" :page="page" :extend="`&tab=${tab || ''}`"></pager>
        <ul>
          <li v-for="item in list" :key="item.id">
            <tieba-cell :cell="item"></tieba-cell>
          </li>
        </ul>
        <pager class="topics-papge" :page="page"></pager>
      </div>
      <!-- <div class="topics-aside">
        <User class="topics-card"></User>
      </div> -->
    </div>
  </div>
</template>

<script>
import { ajaxGet } from '~/plugins/util'
import TiebaCell from '~/components/topics/tieba-cell'
import Banner from '~/components/topics/banner'
import User from '~/components/topics/user'
import Danmaku from '~/components/topics/danmaku'
import Pager from '~/components/pager'

const getData = (page = 1, tab, self) => {
  return new Promise(resolve => {
    let param = {
      page,
      tab,
      limit: 20,
      mdrender: false
    }
    ajaxGet('/topics', param).then(data => {
      data = data.map(item => {
        let md = item.content
        /* eslint-disable-next-line */
        let reg = /\!{1}\[(.*?)\]\((.*?)\)/g
        let list = []
        let allStr = ''
        while ((allStr = reg.exec(md)) !== null) {
          list.push(allStr[2])
        }
        item.imgList = list
        item.content = item.content.slice(0, 80) + '...'
        return item
      })
      if (self) {
        self.list = data
        self.page = page
        document.body.scrollTop = 0
      }
      resolve(data)
    })
  })
}

export default {
  components: {
    TiebaCell,
    Banner,
    Pager,
    Danmaku,
    User
  },
  async asyncData (route) {
    let {page, tab} = route.query
    let data = await getData(page, tab)
    return {
      list: data
    }
  },
  data() {
    return {
      page: ~~this.$route.query.page || 1,
      tab: this.$route.query.tab || '',
      navList: [
        {
          link: '/topics',
          text: '全部',
          tab: '',
          active: false
        },
        {
          link: '/topics?tab=good',
          text: '精华',
          tab: 'good',
          active: false
        },
        {
          link: '/topics?tab=share',
          text: '分享',
          tab: 'share',
          active: false
        },
        {
          link: '/topics?tab=ask',
          text: '问答',
          tab: 'ask',
          active: false
        },
        {
          link: '/topics?tab=job',
          text: '招聘',
          tab: 'job',
          active: false
        },
        {
          link: '/topics?tab=dev',
          text: '客户端测试',
          tab: 'dev',
          active: false
        }
      ]
    }
  },
  watch: {
    $route() {
      this.page = ~~this.$route.query.page || 1
      this.tab = this.$route.query.tab
      this.getData()
    }
  },
  methods: {
    getData() {
      getData(this.page, this.tab, this)
    }
  }
}
</script>

<style lang="less">
.topics {
  width: 1080px;
  margin: 0 auto 50px;
  background-color: #fff;
}
.topics-papge {
  padding: 15px 20px;
}
.topics-nav {
  height: 50px;
  line-height: 50px;
  border-top: 1px solid #dbdce0;
  border-bottom: 1px solid #dbdce0;
  background-color: #eceff2;
  .topics-nav-link {
    height: 100%;
    padding: 0 20px;
    font-size: 16px;
    display: inline-block;
    &.active {
      background-color: #dfe0e4;
    }
  }
}
.topics-content {
  display: flex;
}
.topics-main {
  flex: 1;
  border-right: 1px solid #ddd;
  overflow: hidden;
}
.topics-aside {
  width: 240px;
}
.topics-card {
  padding: 15px;
  border-bottom: 1px solid #ddd;
  h3 {
    font-size: 14px;
  }
}
</style>
