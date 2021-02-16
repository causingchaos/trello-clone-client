// eslint-disable-next-line import/no-cycle
import router from '../router/index';

const actions = {
  async login(context, { valid, user }) {
    if (valid) {
      // eslint-disable-next-line no-undef
      context.dispatch('auth/authenticate', {
        strategy: 'local',
        username: user.username,
        password: user.password,
      }, { root: true }).then(async () => {
        router.push('/boards');
      }).catch((error) => {
        console.log('Authentication error', error);
      });
    }
  },
};

export default {
  namespaced: true,
  actions,
};
