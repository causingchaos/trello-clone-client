<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <v-form v-model="valid" @submit.prevent="login" @keydown.prevent.enter
          v-if="!loading"
        >
          <v-text-field
            v-model="user.username"
            :rules="notEmptyRules"
            label="Username"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.password"
            :rule="notEmptyRules"
            label="Password"
            type="password"
            required
          ></v-text-field>
          <v-btn type="submit" :disabled="!valid" color="primary">Login</v-btn>
        </v-form>
        <v-progress-circular
          v-if="loading"
          :width="7" :size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

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
        this.authenticate({
          strategy: 'local',
          username: this.user.username,
          password: this.user.password,
        }).then((response) => {
          // eslint-disable-next-line no-console
          console.log(response);
          console.log('logged in!!');
        });
      }
    },
  },
};
</script>
