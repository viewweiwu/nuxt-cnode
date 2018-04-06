import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'

const $ajax = axios.create({
  baseURL: 'https://cnodejs.org/api/v1',
  timeout: 10000
})

$ajax.interceptors.response.use(function(response) {
  let data = response.data
  if (data.success) {
    return data
  } else {
    return Promise.reject(error)
  }
}, function(error) {
  return Promise.reject(error)
})

const ajaxPost = (api, data = null) => $ajax.post(api, qs.stringify(data))
const ajaxGet = (api, data = null) => $ajax.get(api, { params: {...data, '_': new Date().getTime() } })
const jsonPost = (api, data = null) => $ajax.post(api, data)
const $bus = new Vue()

Vue.prototype.$ajaxPost = ajaxPost
Vue.prototype.$ajaxGet = ajaxGet
Vue.prototype.$jsonPost = jsonPost
Vue.prototype.$bus = $bus


export {
  ajaxGet,
  ajaxPost,
  jsonPost
}