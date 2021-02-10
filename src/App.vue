<template>
  <v-app style>
    <app-navbar
      :user="user"
      :logout="logout"
    ></app-navbar>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<style>
/* import base styles */
@import './views/app.css';
</style>
<script>
import { mapState } from 'vuex';
import AppNavbar from './components/AppNavbar.vue';

export default {
  name: 'App',
  components: {
    AppNavbar,
  },
  mounted() {
    this.$store.dispatch('auth/authenticate').then(() => {
      console.log('DEBUG -- App.vue -- user is authenticated');
    }).catch(() => {
      console.log('DEBUG -- App.vue -- user is not authenticated');
    });
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout')
        .then(() => {
          this.$router.go({ name: 'login' });
          // Todo -- Need to clear all state upon logout, only some state clearing
          // , use feathers directive
        });
    },
  },
  computed: {
    // this will assign this.user.user to the component class
    ...mapState('auth', { user: 'payload' }),
  },
};
</script>
