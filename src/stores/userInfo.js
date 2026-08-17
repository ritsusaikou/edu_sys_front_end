import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '../utils/request'

export const useUserInfoStore = defineStore('userInfo', {
    state: () => {
        return {
            userInfo: {}

        }
    },
    // 也可以这样定义
    // state: () => ({ count: 0 })
    actions: {
        login(userInfo) {
            this.userInfo = userInfo
        },
        logout() {
            this.userInfo = {}
        },
        async getUserInfo(){
          const res= await  request.get("/user/getInfo")
          if(res.code===200){
            this.userInfo = res.data
          }
        }

    },
    persist: true
})
