import router from './router';
import api from '/@/api/api';
import { useTokenStore } from '/@/store/token';
const whiteList = ['/login'];

router.beforeEach(async (to, from, next) => {
  const tokenStore = useTokenStore()
  if (tokenStore.getToken && tokenStore.getToken != '') {
    if(tokenStore.getInfo == ''){
      const info = await api.auth.info()
      tokenStore.setInfo(info.data)
    }
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    }else{
      next({ path: '/login' })
    }
  }
})

router.afterEach(() => { })
