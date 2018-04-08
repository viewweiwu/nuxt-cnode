<template>
  <div class="topics-new">
    <div class="new-header">
      <input placeholder="请输入标题" class="new-title" type="text">
      <span class="new-right">
        <button class="new-btn new-btn-save">保存</button>
        <button class="new-btn">发布</button>
      </span>
    </div>
    <MdEditor></MdEditor>
  </div>
</template>

<script>
import MdEditor from '~/components/md-editor'

export default {
  components: {
    MdEditor
  },
  data() {
    return {
      isFull: false
    }
  }
}
</script>

<style lang="less">
.topics-new {
  width: 1080px;
  margin: 0 auto 50px;
  position: relative;
  background-color: #fff;
  .new-header {
    height: 70px;
    padding: 10px;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
  }
  .new-title {
    padding: 10px;
    height: 50px;
  }
  .new-btn {
    width: 100px;
    height: 50px;
    border: 1px solid #ddd;
    color: #fff;
    background-color: #58f;
    cursor: pointer;
  }
  .new-btn-save {
    background-color: #0da5a2;
  }
  .new-btn + .new-btn {
    margin-left: 10px;
  }
  .new-right {
    float: right;
  }
}
</style>
