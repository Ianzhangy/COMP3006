import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '/@/router';
import { useTokenStore } from '/@/store/token';

const service = axios.create({
    baseURL: "/api/v1",
    // baseURL: "mock", // mock
    timeout: 15000 
})


service.interceptors.request.use(async config => {
    const tokenStore = useTokenStore()
    if (tokenStore.getToken) {
        config.headers['Authorization'] = "Bearer " + tokenStore.getToken
    }
    return config
}, error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
})

service.interceptors.response.use(
    response => {
        let res = response.data
        
        return Promise.resolve(res);
    },
    err => {
        console.log(err.response)
        if (err.response.status == 401 || err.response.status == 403) {
            const tokenStore = useTokenStore()
            tokenStore.setToken('')
            router.push("/login")

        }
        ElMessage.error(err.response.data.error)
        return Promise.reject(err.response.data)
    }
)


export default service