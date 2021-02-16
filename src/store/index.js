import Vue from 'vue';
import Vuex from 'vuex';
// import feathersVuex from 'feathers-vuex';
import { FeathersVuex } from '../feathers-client';

import auth from './store.auth';
// Need to manually import each of the modules and list in plugin array
import userServicePlugin from './services/users';
import boardServicePlugin from './services/boards';
import listServicePlugin from './services/lists';
import cardServicePlugin from './services/cards';
import activityServicePlugin from './services/activities';

<<<<<<< HEAD
// Custom vuex modules
=======
// eslint-disable-next-line import/no-cycle
>>>>>>> 5ce21bc8b68ec07a1eac9b6eff8c94118c41fac6
import login from './login';
import boardStore from './boardStore';

/*
const {
  auth,
  service,
  FeathersVuex,
} = feathersVuex(feathersClient, { idField: '_id' });
*/
Vue.use(Vuex);
Vue.use(FeathersVuex);

export default new Vuex.Store({
  // Custom modules we defined, i.e. login.js
  modules: {
    login,
    boardStore,
  },
  plugins: [
    userServicePlugin,
    boardServicePlugin,
    listServicePlugin,
    cardServicePlugin,
    activityServicePlugin,
    auth,
  ],
  state: {},
  actions: {},
  mutations: {},
  /* // DUE TO feathers-vuex V3, moved user instanced defaults to services/users.js
  plugins: [
    // Setup the auth plugin
    service('users', {
      instanceDefaults: {
        username: '',
        password: '',
        displayName: '',
        imageUrl: '',
      },
    }),
    auth({
      userService: 'users',
    }),
  ],
  */
});
