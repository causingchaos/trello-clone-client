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
  plugins: [
    userServicePlugin,
    boardServicePlugin,
    listServicePlugin,
    cardServicePlugin,
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
