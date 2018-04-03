import Vue from 'vue'
import axios from 'axios'

const $ajax = axios.create({
  baseURL: 'https://cnodejs.org/api/v1',
  timeout: 10000
})

$ajax.interceptors.response.use(function(response) {
  let data = response.data
  console.log(data.success)
  if (data.success) {
    return data.data
  } else {
    return Promise.reject(error)
  }
}, function(error) {
  return Promise.reject(error)
})

const ajaxPost = (api, data = null) => $ajax.post(api, qs.stringify(data))
const ajaxGet = (api, data = null) => $ajax.get(api, { params: {...data, '_': new Date().getTime() } })
const jsonPost = (api, data = null) => $ajax.post(api, data)

Vue.prototype.$ajaxPost = ajaxPost
Vue.prototype.$ajaxGet = ajaxGet
Vue.prototype.$jsonPost = jsonPost

export {
  ajaxGet,
  ajaxPost,
  jsonPost
}