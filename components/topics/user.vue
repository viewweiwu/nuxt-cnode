<template>
  <div class="topics-user">
    <h3>我在本群</h3>
    <div class="user-content">
      <div class="user-avatar">
        <img src="https://avatars0.githubusercontent.com/u/14287892?s=460&v=4" alt="">
      </div>
      <div class="user-info">
        <p>
          <i class="iconfont icon-qq"></i> 王二
        </p>
        <!-- <p>
          <a href="https://github.com/viewweiwu" target="_blank"><i class="iconfont icon-github"></i> viewweiwu</a>
        </p>
        <p>
          <a href="https://segmentfault.com/u/viewweiwu" target="_blank"><i class="icon-sf">sf</i> viewweiwu</a>
        </p> -->
      </div>
    </div>
    <p class="user-title-sub">我在本群信息</p>
    <p title="群里菜鸡一只">排名：99999</p>
  </div>
</template>

<style lang="less">
.topics-user {
  font-size: 12px;
  .user-content {
    margin-top: 10px;
    display: flex;
  }
  .user-avatar {
    width: 70px;
    height: 70px;
    border: 1px solid #ddd;
    padding: 2px;
  }
  .user-info {
    margin-left: 10px;
    flex: 1;
    p {
      line-height: 1.5em;
    }
  }
  .user-title-sub {
    line-height: 3em;
    color: #777;
  }
  .icon-sf {
    color: #fff;
    width: 16px;
    display: inline-block;
    background-color: #666;
    text-align: center;
  }
}
</style>
