<template>
  <v-app>
    <v-app-bar app
      class="mr-30"
    >
      <v-toolbar-title>BackpackersDB</v-toolbar-title>
      <div id="navbar-search">
      <v-text-field @focus="searchOpen" @focusout="searchClose"
        prepend-inner-icon="mdi-magnify"
        id="test"
        hide-details
        dense
        outlined
        single-line
        label="Search"
        class="ml-5"
      ></v-text-field>
        <div id="results-menu" class="hidden">
        <ul class="features-menu">
          <li>Hello</li>
        </ul>
        </div>
      </div>
      <div>Hello</div>
      <v-spacer></v-spacer>
      <v-btn small class="mr-1" :to="{ name: 'signup' }">Signup</v-btn>
      <v-btn small class="mr-0" :to="{ name: 'login' }">Login</v-btn>
    </v-app-bar>
    <v-main>

      <router-view></router-view>
    </v-main>
    <v-footer app>
      <span>&copy; 2018 - Made with 💙 by Justin</span>
    </v-footer>
  </v-app>
</template>

<style>
.hidden{
  display: none;
}
.features-menu li{
  list-style: none;
  background-color: white;
  border: 1px solid lightgrey;
  margin-left: -3px;
  margin-top: 2px;
  padding: 0px;
  width: 228px;
  height: 200px;
  position: absolute;
}
#navbar-search{
  width: 250px;
}
</style>
<script>
// import { mapActions } from 'vuex';

export default {
  name: 'App',
  data() {
    return {
      fixed: false,
    };
  },
  mounted() {
    this.$store.dispatch('auth/authenticate').then(() => {
      this.$router.push('/boards');
    }).catch(() => {
      this.$router.push('/login');
    });
  },
  methods: {
    searchOpen() {
      console.log('Focused');
      document.querySelector('#results-menu').classList.toggle('hidden');
    },
    searchClose() {
      console.log('Un focused');
      document.querySelector('#results-menu').classList.toggle('hidden');
    },
  },
};
</script>
