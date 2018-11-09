import Vue from 'vue'
import axios from 'axios'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import 'vuetify/dist/vuetify.css'
// import 'material-design-icons-iconfont/dist/material-design-icons.css'

import App from './App'

import VueFuse from 'vue-fuse'

import Job from './components/Job'
import Home from './components/Home'
import Customer from './components/Customer'
import Admin from './components/Admin'
import Employee from './components/Employee'
import LocalSettings from './components/LocalSettings'
import GoldCredit from './components/GoldCredit'
import CustomerForm from './components/CustomerForm'
import JobLookup from './components/JobLookup'
import JobForm from './components/JobForm'
import EmployeeForm from './components/EmployeeForm'
import CustomerList from './components/CustomerList'
import JobList from './components/JobList'
import GoldcreditForm from './components/GoldcreditForm'
import PageNotFound from './components/PageNotFound'


Vue.component('CustomerForm', require('./components/CustomerForm.vue').default);
Vue.component('JobLookup', require('./components/JobLookup.vue').default);
Vue.component('JobForm', require('./components/JobForm.vue').default);
Vue.component('EmployeeForm', require('./components/EmployeeForm.vue').default);
Vue.component('LocalSettings', require('./components/LocalSettings.vue').default);
Vue.component('CustomerList', require('./components/CustomerList.vue').default);
Vue.component('JobList', require('./components/JobList.vue').default);
Vue.component('EmployeeJobs', require('./components/EmployeeJobs.vue').default);
Vue.component('EmployeeStats', require('./components/EmployeeStats.vue').default);
Vue.component('Alert', require('./components/Alert.vue').default);
Vue.component('GoldcreditForm', require('./components/GoldcreditForm.vue').default);
Vue.component('PageNotFound', require('./components/PageNotFound.vue').default);

Vue.use(VueRouter)
Vue.use(Vuetify)
Vue.use(VueFuse)

var store = {
  serverURL : null,
  camera: {
    width: null,
    height: null
  },
  alert: {
      status: null,
      msg: null,
      type: null
  },
  setAlert(status, type, msg) {
      this.alert.status = status;
      this.alert.msg = msg;
      this.alert.type = type;       
  }
};

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false


const router = new VueRouter({
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
        name: 'goldcredit',
        component: GoldCredit
      },
      {
        path: '/goldcredit/:id/:cus',
        name: 'goldcus',
        component: GoldCredit
      },
      {
          path: '*',
          name: 'pageNotFound',
          component: PageNotFound
      }
  ],
});

/* eslint-disable no-new */
new Vue({
  components: { App },
  data: {
    store: store
  },
  router,
  template: '<App/>'
}).$mount('#app')
