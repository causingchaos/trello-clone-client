import Vue from 'vue';
import Vuex from 'vuex';
import feathersVuex from 'feathers-vuex';
import feathersClient from '../feathers-client';

const {
  auth,
  service,
  FeathersVuex,
} = feathersVuex(feathersClient, { idField: '_id' });

Vue.use(Vuex);
Vue.use(FeathersVuex);

export default new Vuex.Store({

  plugins: [
    // Setup the auth plugin.
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

});
