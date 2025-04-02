import { createRouter, createWebHistory } from 'vue-router'
import Planning from '../views/Planning.vue'
import Telegram from '../components/Telegram/Telegram.vue'
import Clients from '../views/Clients.vue'
import AddClient from '../views/subviews/AddClient.vue'
import AllClients from '../views/subviews/AllClients.vue'
import TGMain from '../components/Telegram/TGMain.vue'
import TGLogin from '../components/Telegram/TGLogin.vue'
import TGMakeApointment from '../components/Telegram/TGMakeApointment.vue'
import TGClientPage from '../components/Telegram/TGClientPage.vue'
import { checkParams } from './checkParams'
import NoPage from '../components/Telegram/NoPage.vue'
import TGConfirm from '../components/Telegram/TGConfirm.vue'
import SetPassword from '../components/Telegram/SetPassword.vue'

const routes = [
  {
    path: '/planning',
    name: 'Planning',
    component: Planning
  },
  {
    path: '/clients',
    name: 'Clients',
    component: Clients,
    children: [
      {
        path: '/add-client',
        component: AddClient
      },
      {
        path: '/add-client/:clientName',
        component: AddClient,
        name: 'AddClient',
        props: true
      },
      {
        path: '/all-clients',
        component: AllClients
      }
    ]
  },
  {
    path: '/telegram',
    name: 'Telegram',
    component: Telegram,
    children: [
      {
        path: '/telegram',
        component: TGMain
      },
      {
        path: '/telegram/login',
        component: TGLogin
      },
      {
        path: '/telegram/book',
        component: TGMakeApointment
      },
      {
        path: '/telegram/book/:apptID',
        component: TGMakeApointment
      },
      {
        path: '/telegram/client/:id',
        component: TGClientPage,
        meta: {paramsCheckRequired: true}
      },      
      {
        path: '/telegram/confirm',
        component: TGConfirm        
      },
      
    ]
  },
  {
    path: '/reset-password/:token/:id',
    name: 'SetPassword',
    component: SetPassword
  },
  {
    path: '/no-page',
    component: NoPage
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/no-page',
  }
  
]

const router = createRouter({  
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.paramsCheckRequired) {
    const isExistingPage = await checkParams(to.params.id)
    isExistingPage ? next() : next('/telegram/login')
  } else {next()}
})

export default router