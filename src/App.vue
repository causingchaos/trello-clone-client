<template>
  <v-app>
    <v-toolbar
      toolbar
      max-height="50px"
    >Temp</v-toolbar>
    <v-main>
      <router-view></router-view>
    </v-main>
    <v-footer app>
      <span>&copy; 2018 - Made with 💙 by Justin</span>
    </v-footer>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data: () => ({
    //
  }),
};
</script>
