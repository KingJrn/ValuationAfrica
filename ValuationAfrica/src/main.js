import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Create app
const app = createApp(App)

// Create and use pinia
const pinia = createPinia()
app.use(pinia)
app.use(router)

// Mount app
app.mount('#app')