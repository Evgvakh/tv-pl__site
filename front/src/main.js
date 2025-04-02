import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import store from './store'
import router from './router'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

import { VueTelegramPlugin } from 'vue-tg'

import { elevationHover } from './funcs/elevationHover'

const vuetify = createVuetify({
  components,
  directives,
})


createApp(App)
  .component('VueDatePicker', VueDatePicker)
  .use(router)
  .use(store)
  .use(vuetify)
  .use(VueTelegramPlugin)
  .directive('elevation-hover', elevationHover)
  .mount('#app')
