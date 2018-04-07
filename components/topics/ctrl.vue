<template>
  <div class="topics-ctrl">
    <div class="topics-ctrl-item" @click="backTop">
      <span>😀</span>
      <span>登陆</span>
    </div>
    <div class="topics-ctrl-item" @click="backTop">
      <span>▲</span>
      <span>返回<br>顶部</span>
    </div>
    <Login></Login>
  </div>
</template>

<script>
import Login from '~/components/login'

export default {
  components: {
    Login
  },
  methods: {
    backTop() {
      document.body.scrollTop = 0
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
      span {
        &:first-child {
          display: none;
        }
        &:last-child {
          display: inline;
        }
      }
    }
    span:last-child {
      display: none;
    }
  }
  .topics-ctrl-item + .topics-ctrl-item {
    margin-top: 10px;
  }
}
</style>
