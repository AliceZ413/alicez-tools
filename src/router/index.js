import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Layout',
    redirect: 'zhuanpan',
    component: () => import('../views/layout/Layout.vue'),
    children: [
      {
        path: 'zhuanpan',
        name: 'Zhuanpan',
        component: () => import(/* webpackChunkName: "zhuanpan" */'../views/Zhuanpan.vue'),
        meta: {
          title: '转盘'
        },
      }
    ],
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  console.log(to);
  if (to.meta && to.meta.title != '') {
    document.title = to.meta.title;
  }
  next();
});

export default router
