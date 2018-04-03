<template>
  <div class="pager">
    <nuxt-link class="pager-link" :to="`${path}?page=1${extend}`"  v-if="page > 1" title="首页">首页</nuxt-link>
    <nuxt-link class="pager-link" :to="`${path}?page=${page - 1}${extend}`"  v-if="page > 1" title="下一页">上一页</nuxt-link>
    <nuxt-link
      class="pager-link"
      v-for="item in list"
      :to="`${path}?page=${item}${extend}`"
      :key="item"
      :class="{active: item === page}"
      :title="item"
    >
      {{item}}
    </nuxt-link>
    <nuxt-link class="pager-link" :to="`${path}?page=${page + 1}${extend}`" title="下一页">下一页</nuxt-link>
  </div>
</template>

<script>
export default {
  props: {
    page: {
      type: Number,
      default: 1
    },
    size: {
      type: Number,
      default: 10
    },
    extend: {
      type: String,
      default: ''
    }
  },
  computed: {
    path() {
      return this.$route.path
    },
    list() {
      let list = []
      let size = this.size / 2
      let i = this.page - size
      if (i < 1) i = 1
      while (i < this.page + size) {
        list.push(i)
        i += 1
      }
      return list
    }
  }
}
</script>

<style lang="less">
.pager {
  overflow: hidden;
  .pager-link {
    line-height: 1;
    padding: 5px 9px;
    border: 1px solid #e6e6e6;
    color: #666;
    background-color: #fff;
    float: left;
    text-align: center;
    &:hover {
      color: #3e89fe;
      border: 1px solid #3e89fa;
    }
    &.active {
      color: #3e89fe;
      border: none;
    }
  }
  .pager-link + .pager-link {
    margin-left: 5px;
  }
}
</style>
