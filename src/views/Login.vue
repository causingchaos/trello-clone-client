<template>
  <v-container class="default-container pa-0">
    <v-parallax height="800" src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1353&q=80">
      <v-row align="center" justify="center">
        <v-card class="card pa-10"
          elevation="8"
        >
          <v-form v-model="valid" @submit.prevent="login" @keydown.prevent.enter
          v-if="!loading"
          >
            <h3>Welcome Back!</h3>
            <v-text-field class="pt-8"
              outlined
              dense
              v-model="user.username"
              :rules="notEmptyRules"
              label="Username"
              required
            ></v-text-field>
            <v-text-field class="pt-4"
              outlined
              dense
              v-model="user.password"
              :rules="notEmptyRules"
              label="Password"
              required
            ></v-text-field>
          <v-btn width="100%" class="mt-5" type="submit" :disabled="!valid"
            color="primary"
          >Login</v-btn>
        </v-form>
        <v-progress-circular
          v-if="loading"
          :width="7" :size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>
        </v-card>
    </v-row>
    </v-parallax>
  </v-container>
</template>

<style scoped>
.card {
  width: 450px;
  height: 360px;
}
@media only screen and (max-width: 600px) {
  .card{
    width: 85%;
  }
}
</style>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'login',
  // eslint-disable-next-line no-unused-vars
  data: (vm) => ({ // add vm here passing in to get access to all data on model
    valid: false,
    user: {
      username: '',
      password: '',
    },
    // additional state objects on the feathers-vuex api (https://feathers-vuex-v1.netlify.app/service-module.html#service-state)
    notEmptyRules: [(value) => !!value || 'Cannot be empty'],
  }),
  computed: {
    ...mapState('auth', { loading: 'isAuthenticatePending' }),
  },
  methods: {
    ...mapActions('auth', ['authenticate']),
    ...mapActions('auth', ['reAuthenticate']),
    login() {
      if (this.valid) {
        this.$store.dispatch('auth/authenticate', {
          strategy: 'local',
          username: this.user.username,
          password: this.user.password,
        }).then(() => {
          console.log('pushing user to boards');
          this.$router.push('/boards');
        }).catch((error) => {
          console.log('Authentication error', error);
        });
        /*
        this.authenticate({
          strategy: 'local',
          username: this.user.username,
          password: this.user.password,
        }).then((response) => {
          // eslint-disable-next-line no-console
          console.log(response);
          console.log('logged in!!');
        });
        */
      }
    },
  },
};
</script>
