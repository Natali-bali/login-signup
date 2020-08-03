import Vue from 'vue'
import Vuex from 'vuex'
import axios from './axios-auth.js'
import globalAxios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    idToken: null,
    userId: null,
    user: null
  },
  mutations: {
    authUser (state, userData) {
      state.idToken = userData.idToken;
      state.userId = userData.userId;
    },
    storeUser (state, user) {
      state.user = user
    }
  },
  actions: {
     signup ({ commit, dispatch }, authData) {
        axios.post('/accounts:signUp?key=AIzaSyBWDgzYzvA-JDqGcvLKhJZjYnSDZq90GdU', {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
        })
        .then(res => {
          console.log('signed up', res);
          commit('authUser', {
            idToken: res.data.idToken,
            userId: res.data.localId
          })
          dispatch('storeUser', authData)
        })
        .catch(err => console.log(err))
      },
      login ({ commit }, authData) {
        axios.post('/accounts:signInWithPassword?key=AIzaSyBWDgzYzvA-JDqGcvLKhJZjYnSDZq90GdU', {
          email: authData.email,
          password: authData.password,
          returnSecureToken: true
          })
          .then(res => {
            console.log('logged in',res);
            commit('authUser', {
              idToken: res.data.idToken,
              userId: res.data.localId
            })})
          .catch(err => console.log(err))
      },
      storeUser ({ commit }, userData) {
        globalAxios.post('/users.json', userData)
        .then(res=> console.log('data written', res))
        .catch(err=> console.log(err))
      },

      fetchUser ({commit, state}) {
        if (!state.idToken) {
          return
        }
        globalAxios.get('/users.json' + '?auth=' + state.idToken)
          .then(res => {
            console.log(res)
            const data = res.data
            const users = []
            for (let key in data) {
              const user = data[key]
              user.id = key
              users.push(user)
            }
            console.log(users)
            commit('storeUser', users[0])
          })
          .catch(error => console.log(error))
      }
  },
  getters: {
    user (state) {
      return state.user
    }
  }
})