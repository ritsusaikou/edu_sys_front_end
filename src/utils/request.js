import axios from 'axios'
import router from '../router'


// 创建axios实例
const service = axios.create({
  baseURL: '/api', // 配合vite代理
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 可以统一添加token
    // config.headers.Authorization = \`Bearer ${localStorage.getItem('token')}\`
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 直接返回后端data，根据你后端返回格式自行调整
    // console.log("9992" + JSON.stringify(response.data))
    return Promise.resolve(response.data)
  },
  error => {
    console.error('请求错误：', error)
    const status=error.response.status;
    console.log("🚀 ~ status:", status)
    if (status=== 401) {
      
      document.cookie = "satoken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"
      console.log("🚀 ~ document:", document)
      router.push("/login")
    }
    return Promise.reject(error)
  }
)


const request = {
  get(url, params, config) {
    return service({
      url,
      method: 'GET',
      params,
      ...config
    })
  },

  post(url, data, config) {
    return service({
      url,
      method: 'POST',
      data,
      ...config
    })
  },

  put(url, data, config) {
    return service({
      url,
      method: 'PUT',
      data,
      ...config
    })
  },

  delete(url, params, config) {
    return service({
      url,
      method: 'DELETE',
      params,
      ...config
    })
  }
}

export default request