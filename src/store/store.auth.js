// As per https://vuex.feathersjs.com/getting-started.html#service-plugins   v2
import { makeAuthPlugin } from '../feathers-client';

export default makeAuthPlugin({ userService: 'users' });
