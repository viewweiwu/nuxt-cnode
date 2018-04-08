<template>
  <div class="banner">
    <div class="banner-bg"></div>
    <div class="banner-info">
      <a target="_blank" href="//shang.qq.com/wpa/qunwpa?idkey=cbc7299cbc5ac88cc77dc76057ace6340d50847e18016a80aa33d45bb6e9462b" class="banner-logo">
        <img src="https://avatars1.githubusercontent.com/u/15885749?s=460&v=4" alt="">
      </a>
      <div class="banner-content">
        <h2>
          前端大杂烩
          <span class="banner-sub">
            <a target="_blank" href="//shang.qq.com/wpa/qunwpa?idkey=cbc7299cbc5ac88cc77dc76057ace6340d50847e18016a80aa33d45bb6e9462b" class="banner-connect">
              <i class="iconfont icon-qq"></i>
              731175396
            </a>
          </span>
        </h2>
        <h3>
          vue，react，ng，nodejs，webgl。想要啥就有啥，本群仅供学习交流。</h3>
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
  background-color: #eee;
  position: relative;
  display: block;
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
.banner-sub {
  font-size: 14px;
  color: #777;
  a {
    color: inherit;
    &:hover {
      color: #58f;
    }
  }
}
</style>
