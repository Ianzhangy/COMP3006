import { defineStore } from 'pinia'


export const useTokenStore = defineStore('token',{
  state: () => ({
    token: localStorage.getItem('token') || '',
    info: ''
  }),
  getters: {
    getToken: (state) => state.token,
    getInfo: (state) => state.info
  },
  actions: {
    setToken(data) {
      this.token = data
      localStorage.setItem('token', data)
    },
    setInfo(data) {
      this.info = data
    }
  }
})