import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({
  state: {
    user: {}
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    }
  },
  actions: {
    setUserData({commit, state}, user) {
      if (user) {
        commit('setUser', user)
      }
    }
  },
  getters: {
    user: (state) => state.user
  }
})

export default store
