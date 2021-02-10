<template>
    <v-app-bar app
      class="mr-30"
    >
      <v-toolbar-title class="ml-0">
        <v-btn class="pa-0" :to="{ name: 'Home' }" plain>Trello</v-btn>
      </v-toolbar-title>
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
      <v-spacer></v-spacer>
      <div v-if="!user">
        <v-btn small class="mr-1" :to="{ name: 'signup' }">Signup</v-btn>
        <v-btn small class="mr-0" :to="{ name: 'login' }">Login</v-btn>
      </div>
      <div v-if="user">
        <v-btn @click="logout" small class="mr-2">Logout</v-btn>
        <v-menu
          bottom
          min-width="200px"
          rounded
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-avatar color="primary" size="40" class="mr-0">
              <img :src="user.user.imageUrl" alt="avatar">
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-list-item-content class="justify-center">
              <div class="mx-auto text-center">
                <v-avatar color="primary" size="40" class="mb-3">
                  <img :src="user.user.imageUrl" alt="avatar">
                </v-avatar>
                <h3>{{ user.user.displayName }}</h3>
                <p>UserID: {{ user.user.id }}</p>
                <v-divider class="my-3"></v-divider>
                <v-btn small>Profile</v-btn>
                <v-divider class="my-3"></v-divider>
                <v-btn small :to="{ name: 'boards' }">My Boards</v-btn>
                <v-divider class="my-3"></v-divider>
                <v-btn small>Dark Mode</v-btn>
                <v-divider class="my-3"></v-divider>
                <v-btn @click="logout" small>Logout</v-btn>
              </div>
            </v-list-item-content>
          </v-card>
        </v-menu>
      </div>
    </v-app-bar>
</template>

<script>
export default {
  props: ['user', 'logout'], // props: user={}, logout=f()
  methods: {
    searchOpen() {
      // console.log('Focused');
      document.querySelector('#results-menu').classList.toggle('hidden');
    },
    searchClose() {
      // console.log('Un focused');
      document.querySelector('#results-menu').classList.toggle('hidden');
    },
  },
};
</script>

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
