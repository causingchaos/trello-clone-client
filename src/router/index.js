import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import SignUp from '../views/SignUp.vue';
import Login from '../views/Login.vue';
import Boards from '../views/Boards.vue';
import Board from '../views/Board.vue';
import store from '../store/index';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignUp,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/Signup.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/boards',
    name: 'boards',
    component: Boards,
    beforeEnter: (to, from, next) => {
      store.dispatch('auth/authenticate').then(() => {
        next();
      }).catch(() => {
        next('/login');
      });
    },
  },
  {
    path: '/boards/:id',
    name: 'board',
    component: Board,
    beforeEnter: (to, from, next) => {
      store.dispatch('auth/authenticate').then(() => {
        next();
      }).catch(() => {
        next('/login');
      });
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
