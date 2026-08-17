import { createApp } from 'vue'
import App from './App.vue'

import { createPinia } from 'pinia'

//导入Element-Plus核心样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router/index.js'
import ElementPlusLocaleZhCn from 'element-plus/dist/locale/zh-cn.mjs'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'


const pinia = createPinia()
const app = createApp(App)

// pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router) // 使用路由
app.use(ElementPlus,{
    locale:ElementPlusLocaleZhCn,
})
app.mount('#app')


