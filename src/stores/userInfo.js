import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '../utils/request'

export const useUserInfoStore = defineStore('userInfo', {
    state: () => {
        return {
            id: null,
            name: '',
            age: null,
            phone: '',
            role: null,
            email: null,
            photo: null,
            userNo: null,
            // 请求锁，路由守卫防重复调用
            isLoading: false
        }
    },
    actions: {
        login(userInfo) {
            //直接展开赋值到state根属性
            Object.assign(this, userInfo)
        },
        logout() {
            //重置state全部字段
            this.$reset()
        },
        async getUserInfo() {
            this.isLoading = true
            try {
                const res = await request.get("/user/getInfo")
                if (res.code === 200) {
                    //后端返回用户对象直接赋值
                    Object.assign(this, res.data)
                }
            } catch (err) {
                //抛出异常，路由守卫的catch可以捕获
                throw err
            } finally {
                this.isLoading = false
            }
        }
    },
    persist: true
})
