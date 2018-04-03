<template>
  <div class="topic">
    <ul>
      <li v-for="item in list" :key="item.id" class="">
        <tieba-cell :cell="item"></tieba-cell>
      </li>
    </ul>
  </div>
</template>

<script>
import { ajaxGet } from '~/plugins/util'
import TiebaCell from '~/components/topic/tieba-cell'

const getData = () => {
  return new Promise(resolve => {
    let param = {
      limit: 20,
      mdrender: false
    }
    ajaxGet('/topics', param).then(data => {
      data = data.map(item => {
        let md = item.content
        /* eslint-disable-next-line */
        let reg = /\!{1}\[(.*?)\]\((.*?)\)/g
        let list = []
        let allStr = ''
        while ((allStr = reg.exec(md)) !== null) {
          list.push(allStr[2])
        }
        item.imgList = list
        return item
      })
      resolve(data)
    })
  })
}

export default {
  components: {
    TiebaCell
  },
  async asyncData () {
    let data = await getData()
    return {
      list: data
    }
  }
}
</script>

<style lang="less">
.topic {
  width: 1080px;
  margin: 0 auto;
  background-color: #fff;
}
</style>
