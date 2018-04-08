<template>
  <div class="md-editor" :class="{full: mode === 'full'}">
    <div class="md-tool" v-if="hasTool
    ">
      <div class="right">
        <div v-for="item in modeList" class="md-tool-item" :class="{active: mode === item.mode}" :key="item.mode" :title="item.title" @click="onModeChange(item)">
          <i class="iconfont" :class="'icon-' + item.icon"></i>
        </div>
      </div>
    </div>
    <div class="md-body">
      <textarea
        class="md-content"
        :placeholder="placeholder"
        v-model="currValue"
        @input="onInput"
        @keydown="onContentKeydown"
        v-show="mode !== 'view'"
      >
      </textarea>
      <div v-if="hasView" v-show="mode !== 'content'" class="md-view markdown-text" v-html="contentMD"></div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import marked from 'marked'

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String
    },
    hasView: {
      type: Boolean,
      default: true
    },
    hasTool: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currValue: '',
      mode: 'edit',
      modeList: [
        {
          icon: 'fullscreen',
          title: '全屏模式',
          mode: 'full'
        },
        {
          icon: 'alignright',
          title: '编辑模式',
          mode: 'content'
        },
        {
          icon: 'aligncenter',
          title: '实况模式',
          mode: 'edit'
        },
        {
          icon: 'alignleft',
          title: '预览模式',
          mode: 'view'
        }
      ]
    }
  },
  watch: {
    value(value) {
      this.currValue = value
    }
  },
  computed: {
    contentMD() {
      return marked(this.currValue)
    }
  },
  methods: {
    onInput() {
      this.$emit('input', this.currValue)
    },
    onContentKeydown(e) {
      if (e.keyCode === 9) {
        e.preventDefault()
        e.stopPropagation()
        let $target = e.target
        let value = e.target.value
        let start = $target.selectionStart
        let end = $target.selectionEnd
        value = value.slice(0, start) + '    ' + value.slice(end)
        this.currValue = value
        this.$emit('input', value)
        this.$nextTick(() => {
          $target.setSelectionRange(end + 4, end + 4)
        })
      } else if (e.keyCode === 13 && e.ctrlKey) {
        this.$emit('submit')
      }
    },
    onModeChange(item) {
      this.mode = item.mode
    }
  }
}
</script>

<style lang="less">
.md-editor {
  &.full {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    z-index: 2;
    position: fixed;
    .md-body {
      height: 100%;
    }
  }
  .md-tool {
    height: 40px;
    border: 1px solid #ddd;
    border-bottom: none;
    background-color: #fff;
    overflow: hidden;
    .md-tool-item {
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      cursor: pointer;
      &.active,
      &:hover {
        background-color: #eee;
      }
    }
    .right {
      width: 160px;
      float: right;
      .md-tool-item {
        float: left;
      }
    }
  }
  .md-edit {
    margin: 10px;
    display: flex;
  }
  .md-body {
    height: 250px;
    display: flex;
  }
  .md-content {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    background-color: #fff;
  }
  .md-view {
    flex: 1;
    width: 50%;
    border: 1px solid #ccc;
    padding: 10px;
    border-left: none;
    background-color: #fff;
    overflow: auto;
  }
}
</style>
