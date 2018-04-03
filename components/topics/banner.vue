<template>
  <div class="banner">
    <div class="banner-bg"></div>
    <div class="banner-info">
      <div class="banner-logo">
        <img src="https://avatars1.githubusercontent.com/u/15885749?s=460&v=4" alt="">
      </div>
      <div class="banner-content">
        <h2>前端大杂烩</h2>
        <h3>
          群号:<span class="banner-connect">731175396</span>前端大杂烩，vue，react，ng，nodejs，webgl。想要啥就有啥，本群仅供学习交流。</h3>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.banner {
  background-color: #f4f6f9;
}
.banner-bg {
  height: 180px;
  background-color: #6cf;
  background-image: url(//misc.hzzcckj.cn/skin/season/spring/24.jpg!500w);
  background-size: cover;
  overflow: hidden;
}
.banner-info {
  display: flex;
}
.banner-logo {
  width: 150px;
  height: 150px;
  border: 5px solid #fff;
  margin: -75px 20px 0;
  position: relative;
  img {
    width: 100%;
    height: 100%;
  }
}
.banner-content {
  padding: 10px;
  padding-left: 0;
  line-height: 2em;
  h2 {
    font-size: 22px;
    font-weight: normal;
  }
  h3 {
    font-size: 14px;
    color: #4c4c4c;
    font-weight: normal;
  }
}
.banner-btn-star {
  outline: none;
}
.banner-connect {
  margin: 0 3px;
  color: #000;
  cursor: pointer;
}
</style>
