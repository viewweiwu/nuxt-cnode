<template>
  <div ref="login" class="login" v-show="isOpen">
    <div class="login-main">
      <div class="login-title">登录</div>
      <div class="login-body">
        <form @submit.prevent="onSubmit">
          <!-- <p>
            <input v-model="form.loginname" class="login-input" placeholder="请输入用户名" type="text">
          </p> -->
          <textarea v-model="form.accesstoken" class="login-textarea" placeholder="请在这里输入你在 cnode 上面的 accesstoken。"></textarea>
          <p>
            <input v-model="form.isRemind" type="checkbox" id="remind"/>
            <label for="remind"> 记住我 </label>
            <span class="font-gray">(你的 accesstoken 会被存在 localstorage)</span>
          </p>
          <p>
            <button class="btn-submit" type="submit">登录</button>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      form: {
        loginname: '',
        accesstoken: '',
        isRemind: true
      },
      isOpen: false,
      stauts: 'pass'
    }
  },
  mounted() {
    this.form.accesstoken = localStorage.getItem('accesstoken') || ''
    document.body.appendChild(this.$refs.login)
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    open() {
      if (this.user.id) {
        alert('你不需要再登录了')
      } else {
        this.isOpen = true
      }
    },
    close() {
      this.isOpen = false
    },
    onSubmit() {
      if (this.status === 'loading') return
      let param = {
        accesstoken: this.form.accesstoken
      }
      this.stauts = 'loading'
      this.$ajaxPost(`/accesstoken`, param).then(data => {
        let user = {
          loginname: data.loginname,
          avatar_url: data.avatar_url,
          id: data.id,
          accesstoken: param.accesstoken
        }
        this.$store.dispatch('setUserData', user)
        localStorage.setItem('accesstoken', param.accesstoken)
        alert('登录成功')
        this.close()
        this.status = 'pass'
      }, () => this.status = 'pass')
    }
  }
}
</script>

<style lang="less">
.login {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  z-index: 10;
  position: fixed;
  .login-main {
    top: 50%;
    left: 50%;
    width: 400px;
    background-color: #fff;
    position: absolute;
    transform: translate(-50%, -50%);
  }
  .login-title {
    padding: 20px;
    border-bottom: 1px solid #ddd;
    font-size: 18px;
  }
  .login-body {
    padding: 10px 20px;
  }
  .login-input {
    width: 100%;
    height: 40px;
    padding: 5px 10px;
    font-size: 14px;
    border: 1px solid #ddd;
    &:focus {
      border-color: #58f;
    }
  }
  .login-textarea {
    width: 100%;
    height: 100px;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ddd;
    &:focus {
      border-color: #58f;
    }
  }
  p {
    margin: 10px 0;
  }
  .btn-submit {
    width: 100%;
    padding: 10px;
    border: none;
    color: #fff;
    background-color: #58f;
    cursor: pointer;
  }
  .font-gray {
    font-size: 14px;
    color: #999;
  }
}
</style>
