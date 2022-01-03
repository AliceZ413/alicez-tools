import Vue from 'vue'
import Vuex from 'vuex'

import dj from './dj/dj.js';
import musicPlayer from './music-player/music-player';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    dj,
    musicPlayer,
  }
})
