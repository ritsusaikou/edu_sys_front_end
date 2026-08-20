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
const EvaluateCourseScore = () => import('../views/EvaluateCourseScore.vue')
const TestForWs = () => import('../views/TestForWs.vue')

const routes = [
    {
        // 默认指向'/home'
        path: '/',
        redirect: '/home'
    },
    {
        path: '/test-for-WebSocket',
        name: 'TestForWs',
        component: TestForWs
    },
    {
        path: '/evaluate-course-score',
        name: 'EvaluateCourseScore',
        component: EvaluateCourseScore
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
    const token = getTokenFromCookie()

    //登录页直接放行
    if(to.path === '/login'){
        next()
        return
    }

    // 有token、但是用户信息为空、并且当前没有正在请求
    if (token && !userInfoStore.id && !userInfoStore.isLoading) {
        try {
            await userInfoStore.getUserInfo()
            //拿到用户信息之后，直接放行目标地址
            next()
        } catch (err) {
            userInfoStore.logout()
            next('/login')
        }
        return
    }

    next()
})


export default router