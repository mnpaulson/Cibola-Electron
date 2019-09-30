import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // routes: [
  //   {
  //     path: '/',
  //     name: 'welcome-view',
  //     component: require('@/components/WelcomeView').default
  //   },
  //   {
  //     path: '/inspire',
  //     name: 'inspire',
  //     component: require('@/components/InspireView').default
  //   },
  //   {
  //     path: '*',
  //     redirect: '/'
  //   }
  // ]
  routes: [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/job',
        name: 'jobs',
        component: Job
    },
    {
        path: '/job/:id',
        name: 'job',
        component: Job
    },
    {
        path: '/job/:id/:cus',
        name: 'jobcus',
        component: Job
    },
    {
        path: '/admin',
        name: 'admin',
        component: Admin,
    },
    {
        path: '/customer',
        name: 'customers',
        component: Customer
    },
    {
        path: '/customer/:id',
        name: 'customer',
        component: Customer
    },
    {
        path: '/employee',
        name: 'employee',
        component: Employee
    },        
    {
        path: '/goldcredit',
        name: 'goldcredits',
        component: GoldCredit
    },
    {
        path: '/goldcredit/:id',
        name: 'goldcredits',
        component: GoldCredit
    },
    {
        path: '/goldcredit/:id/:cus',
        name: 'goldcredits',
        component: GoldCredit
    },
    {
        path: '/customsheet',
        name: 'customsheets',
        component: CustomSheet
    },
    {
        path: '/customsheet/:id',
        name: 'customsheet',
        component: CustomSheet
    },
    {
        path: '/customsheet/:id/:cus',
        name: 'customsheet',
        component: CustomSheet
    },
    {
        path: '*',
        name: 'pageNotFound',
        component: PageNotFound
    }
],
})
