import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: 'AliceZ-Tools'
    },
  },
  {
    path: '/layout',
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
      },
      {
        path: 'music',
        name: 'Music',
        component: () => import(/* webpackChunkName: "music" */'../views/Music.vue'),
        meta: {
          title: '听听歌'
        },
      },
    ],
  },
  {
    path: '/program',
    name: 'Program',
    component: () => import(/* webpackChunkName: "program" */'../views/Music/Program.vue'),
    meta: {
    },
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
    document.title = to.meta.title || 'AliceZ-Tools';
  }
  next();
});

export default router;
