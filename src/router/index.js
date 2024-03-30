import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Products from '../views/Products.vue'
import Customers from '../views/Customers.vue'
import Orders from '../views/Orders.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/products',
      name: 'products',
      component: Products
    },
    {
      path: '/customers',
      name: 'customers',
      component: Customers
    },
    {
      path: '/orders',
      name: 'orders',
      component: Orders
    }
  ]
})

export default router
