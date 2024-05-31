import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userID: 1,
    username: 'admin',
    isGenerate: false,
    CPUValue:0,
    memoryValue:0,
    invokeRegular:false,
    invokeBursty:false
  },
  getters: {},
  mutations: {
    setUserID(state, userID) {
      state.userID = userID;
    },
    setUsername(state, username) {
      state.username = username;
    },
  },
  actions: {},
  modules: {},
  plugins: [
    createPersistedState({
      storage: window.localStorage,
      key: 'store',
      render(state) {
        return { ...state };
      },
    }),
  ],
});
