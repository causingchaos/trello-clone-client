<template>
  <v-container class="default-container" fill-height fluid >
    <v-row align="center" justify="center">
      <v-card class="card pa-10" elevation="8">
        <v-form v-model="valid" @submit.prevent="signUp" @keydown.prevent.enter
          v-if="!loading"
        >
          <h3>Create an account</h3>
          <v-text-field class="pt-8"
            outlined
            dense
            v-model="user.username"
            :rules="notEmptyRules"
            label="Username"
            required
          ></v-text-field>
          <v-text-field class="pt-3"
            outlined
            dense
            v-model="user.displayName"
            :rules="notEmptyRules"
            label="Display Name"
            required
          ></v-text-field>
          <v-text-field class="pt-3"
            outlined
            dense
            v-model="user.password"
            :rule="notEmptyRules"
            label="Password"
            type="password"
            required
          ></v-text-field>
          <v-text-field class="pt-3"
            outlined
            dense
            v-model="user.confirmPassword"
            :rules="confirmPasswordRules"
            label="Confirm Password"
            type="password"
            required
          ></v-text-field>
          <v-text-field class="pt-3"
            outlined
            dense
            v-model="user.imageUrl"
            :rules="notEmptyRules"
            label="Image Url"
            required
          ></v-text-field>
          <v-btn class="mt-5" type="submit" :disabled="!valid"
            width="100%"
            color="primary"
          >SignUp</v-btn>
        </v-form>
        <v-progress-circular
          v-if="loading"
          :width="7" :size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </v-card>
    </v-row>
  </v-container>
</template>

<style scoped>
.card {
  width: 450px;
}
@media only screen and (max-width: 600px) {
  .card{
    width: 85%;
  }
}
</style>

<script>
import { mapState } from 'vuex';

export default {
  name: 'signUp',
  data: (vm) => ({ // add vm (view-model) here passing in to get access to all data on model
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
        // 2.x way
        // new this.$FeathersVuex.api.User({}) // Assuming default serverAlias of `api`.
        const user = new this.$FeathersVuex.api.User(this.user);
        delete user.confirmPassword;
        user.save().then((createdUser) => { // note save will auto check for create, update, ect
          console.log(createdUser);
        }).catch((error) => {
          console.log('error', error);
        });
        /*  old 1.xx way
        const { User } = this.$FeathersVuex;
        const user = new User(this.user);
        console.log(this.user);
        delete user.confirmPassword;
        user.save().then((createdUser) => {
          // eslint-disable-next-line no-console
          console.log(createdUser);
          this.$router.push('/login');
        }); // don't need to use .create
        */
      }
    },
  },
};
</script>
