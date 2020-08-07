import Vue from 'vue'
import Vuex from 'vuex'
import axios from './axios-auth.js'
import globalAxios from 'axios'
import router from './router'

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
    },
    clearAuthData (state) {
      state.idToken = null;
      state.userId = null
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
          dispatch('setLogoutTimer', res.data.expiresIn);
          const dateNowStorage = new Date(); //add local storage to safe token and keep user signed up
          const expInStorage = dateNowStorage.getTime() + res.data.expiresIn*1000;
          localStorage.setItem('tokenStorage', res.data.idToken) 
          localStorage.setItem('expDateStorage', expInStorage)
          localStorage.setItem('userIdStorage', res.data.userId)
          router.replace('./loggedin')
        })
        .catch(err => console.log(err));
        
      },
      login ({ commit, dispatch }, authData) {
        axios.post('/accounts:signInWithPassword?key=AIzaSyBWDgzYzvA-JDqGcvLKhJZjYnSDZq90GdU', {
          email: authData.email,
          password: authData.password,
          returnSecureToken: true
          })
          .then(res => {
            console.log('logged in',res);
            const dateNowStorage = new Date(); //add local storage to safe token and keep user signed up
            const expInStorage = dateNowStorage.getTime() + res.data.expiresIn*1000;
            localStorage.setItem('tokenStorage', res.data.idToken) 
            localStorage.setItem('expDateStorage', expInStorage)
            localStorage.setItem('userIdStorage', res.data.localId)
            commit('authUser', {
              idToken: res.data.idToken,
              userId: res.data.localId
            })
            dispatch('setLogoutTimer', res.data.expiresIn);
            
          })
          .catch(err => console.log(err));
          router.replace('./loggedin')
      },
      tryAutoLogin({commit}) {
        const userToken = localStorage.getItem('tokenStorage');
        const exparationDate = localStorage.getItem('expDateStorage')
        const nowDate = new Date();
       
        if (!userToken ) {
          router.replace('./')
          return
        }
        if (exparationDate <= nowDate) {
          router.replace('./')
          return
        }
        console.log(exparationDate, '  ', nowDate)
        const userId = localStorage.getItem('userIdStorage');
        commit('authUser', {
          token: userToken,
          userId: userId
        })
      },
      
      logout ({ commit }) {
        commit('clearAuthData'); //we commit mutation 
        router.replace('./');
        localStorage.removeItem('tokenStorage') 
        localStorage.removeItem('expDateStorage')
        localStorage.removeItem('userIdStorage')

      },
      //add automatical logout when token is expired(1hr)
      setLogoutTimer ({commit}, exparationTime) {
        setTimeout(() => {
          commit('clearAuthData');
          router.replace('./')  //we commit mutation 
        },exparationTime*1000); //we dispatch it in signup and login(add dispatch method in contecst object)
       
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
            const data = res.data;
            console.log('data', data);
            const users = [];
            const index = state.userId;
            //console.log(index);
            for (let key in data) {
              const user = data[key]
              user.id = key
              users.push(user)
            }
            console.log(users)
            commit('storeUser', users[1])
          })
          .catch(error => console.log(error))
      }
  },
  getters: {
    user (state) {
      return state.user
    },
    isAuthenticated(state) {
      return state.idToken !== null;
    }
  }
})