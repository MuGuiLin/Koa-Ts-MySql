import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import user from "./modules/user"

export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {

  },
  modules: {
    
    // 拆分模块
    user
  }

});
