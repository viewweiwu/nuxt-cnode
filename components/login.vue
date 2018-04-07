<template>
  <div ref="login" class="login">
    <div class="login-main">
      <textarea placeholder="请在这里输入你在 cnode 上面的 accesstoken"></textarea>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    document.body.appendChild(this.$refs.login)
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
    height: 400px;
    background-color: #fff;
    position: absolute;
    transform: translate(-50%, -50%);
  }
}
</style>
