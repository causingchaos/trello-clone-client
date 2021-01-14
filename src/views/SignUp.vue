<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <v-form v-model="valid" @submit.prevent="signUp" @keydown.prevent.enter
          v-if="!loading"
        >
          <v-text-field
            v-model="user.username"
            :rules="notEmptyRules"
            label="Username"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.displayName"
            :rules="notEmptyRules"
            label="Display Name"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.password"
            :rule="notEmptyRules"
            label="Password"
            type="password"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.confirmPassword"
            :rules="confirmPasswordRules"
            label="Confirm Password"
            type="password"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.imageUrl"
            :rules="notEmptyRules"
            label="Image Url"
            required
          ></v-text-field>
          <v-btn type="submit" :disabled="!valid" color="primary">SignUp</v-btn>
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
import { mapState } from 'vuex';

export default {
  name: 'signUp',
  data: (vm) => ({ // add vm here passing in to get access to all data on model
    valid: false,
    user: {
      username: '',
      password: '',
      confirmPassword: '',
      displayName: '',
      imageUrl: '',
    },
    // additional state objects on the feathers-vuex api (https://feathers-vuex-v1.netlify.app/service-module.html#service-state)
    notEmptyRules: [(value) => !!value || 'Cannot be empty'],
    confirmPasswordRules: [(confirmPassword) => confirmPassword === vm.user.password || 'Password must match'],
  }),
  computed: {
    ...mapState('users', { loading: 'isCreatePending' }),
  },
  methods: {
    signUp() {
      if (this.valid) {
        console.log('attempting submit');
        const { User } = this.$FeathersVuex;
        const user = new User(this.user);
        delete user.confirmPassword;
        user.save().then((createdUser) => {
          // eslint-disable-next-line no-console
          console.log(createdUser);
          this.$router.push('/login');
        }); // don't need to use .create
      }
    },
  },
};
</script>
