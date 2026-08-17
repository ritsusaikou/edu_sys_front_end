import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs'
import { createRouter, createWebHistory } from 'vue-router'
import { useUserInfoStore } from '../stores/userInfo.js'

const Home = () => import('../views/Home.vue')
const About = () => import('../views/About.vue')
const Course = () => import('../views/Course.vue')
const Class = () => import('../views/Class.vue')
const Login = () => import('../views/Login.vue')
const Register = () => import('../views/Register.vue')
const UserCenter = () => import('../views/UserCenter.vue')
const CourseChoice = () => import('../views/CourseChoice.vue')
const ScoreQuery = () => import('../views/ScoreQuery.vue')
const routes = [
    {
        // 默认指向'/home'
        path: '/',
        redirect: '/home'
    },
    {
        path: '/score-query',
        name: 'ScoreQuery',
        component: ScoreQuery
    },
    {
        path: '/about',
        name: 'About',
        component: About
    },
    {
        path: '/home',
        name: 'Home',
        component: Home
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/class',
        name: 'Class',
        component: Class
    },
    {
        path: '/course',
        name: 'Course',
        component: Course
    },
    {
        path: '/course-choice',
        name: 'CourseChoice',
        component: CourseChoice
    },
    {
        path: '/user-center',
        name: 'UserCenter',
        component: UserCenter
    },
    //404兜底路由
    {
        path: '/:pathMatch(.\*)\*',
        redirect: '/home'
    }

]

const router = createRouter({
    history: createWebHistory(),// history模式（不带#）
    routes
})

// 封装：从cookie中读取satoken
const getTokenFromCookie = () => {
    const cookieStr = document.cookie
    const tokenName = 'satoken' // satoken默认cookie键名等于satoken
    const arr = cookieStr.split(';')
    for (let item of arr) {
        const cookieItem = item.trim();
        if (cookieItem.startsWith(tokenName)) {
            return cookieItem.substring(tokenName.length + 1)
        }
    }
    return null;
}

// 全局路由守卫
router.beforeEach(async (to, from, next) => {
    const userInfoStore = useUserInfoStore()
    // 从cookie中拿到token
    const token = getTokenFromCookie()
    if (token && !userInfoStore.userInfo.id) {
        // console.log("userInfo没有值")
        try {
            await userInfoStore.getUserInfo()
            // 重新触发一次守卫，带上replace避免历史冗余
            next({ ...to, replace: true })
            return
        } catch (err) {
            // token失效、接口报错，清空登录态跳登录
            userInfoStore.logout()
            next('/login')
            return
        }
    }

    // console.log(token)

    // 所有人都能访问的名单
    const allAccessList = ['/about', '/home']
    // 不需要登录的白名单
    const whiteList = ['/login', '/register']
    if (allAccessList.includes(to.path)) { // 1.白名单内
        next();
    } else if (whiteList.includes(to.path)) {
        token ? next('/home') : next()
    }
    else { //2.非白名单
        token ? next() : next('/login')
    }

})


export default router