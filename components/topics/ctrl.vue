<template>
  <div class="topics-ctrl">
    <div class="topics-ctrl-item" v-if="user.id" @click="logout">
      <img class="main" :src="user.avatar_url" alt="">
      <span class="extra">退出</span>
    </div>
    <div class="topics-ctrl-item" v-if="user.id">
      <i class="iconfont icon-edit main"></i>
      <span class="extra">新建<br>帖子</span>
    </div>
    <div class="topics-ctrl-item" v-else @click="login">
      <span class="main">
        <i class="iconfont icon-smile"></i>
      </span>
      <span class="extra">登录</span>
    </div>
    <div class="topics-ctrl-item" @click="backTop">
      <span class="main">
        <i class="iconfont icon-top"></i>
      </span>
      <span class="extra">返回<br>顶部</span>
    </div>
    <Login ref="login"></Login>
  </div>
</template>

<script>
import Login from '~/components/login'
import { mapGetters } from 'vuex'

export default {
  components: {
    Login
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    backTop() {
      document.body.scrollTop = 0
    },
    login() {
      this.$refs.login.open()
    },
    logout() {
      sessionStorage.removeItem('user')
      this.$store.dispatch('setUserData', {})
    }
  }
}
</script>

<style lang="less">
.topics-ctrl {
  bottom: 100px;
  left: 50%;
  margin-left: 540px;
  position: fixed;
  .topics-ctrl-item {
    width: 50px;
    height: 50px;
    padding: 5px;
    border: 1px solid #ddd;
    color: #777;
    background-color: #eee;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    &:hover {
      color: #fff;
      background-color: #58f;
      border-color: #58f;
      .main {
        display: none;
      }
      .extra {
        display: inline-block;
      }
    }
    .extra {
      display: none;
    }
  }
  .topics-ctrl-item + .topics-ctrl-item {
    margin-top: 10px;
  }
  .icon-smile,
  .icon-edit {
    font-size: 30px;
  }
  .icon-top {
    font-size: 20px;
    font-weight: bold;
  }
}
</style>
