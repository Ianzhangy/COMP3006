import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import 'element-plus/dist/index.css';
import { createPinia } from 'pinia';
import 'virtual:uno.css';
import { createApp } from "vue";
import App from "./App.vue";
import api from './api/api';
import List from "./components/List.vue";
import './permission.js';
import router from './router';
import "./style.scss";
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
const pinia = createPinia()

app.config.globalProperties.$api = api
app.use(List)
app.use(router)
app.use(pinia)
app.mount('#app')


export default app
