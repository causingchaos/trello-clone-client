<template>
  <div class="box">
    <div id="header">
      <h1 class="pa-3">Vuetify playground</h1>
      <div id="nav-icons">
        <v-btn class="ma-2" elevation="2"
        >Spacing</v-btn>
        <v-btn class="ma-2" elevation="2"
        >Spacing</v-btn>
        <v-btn class="ma-2" elevation="2"
        >Spacing</v-btn>
      </div>
    </div>
    <Spacing v-if:="spacing"></Spacing>
  </div>
</template>

<script>
import Spacing from './playground/Spacing.vue';

export default {
  components: {
    Spacing,
  },
  data: () => ({
    count: 0,
    spacing: true,
  }),
};
</script>

<style scoped>
h1{
  text-align: center;
}
.box{
  background-color: lightgrey;
}
#nav-icons{
  display: flex;
  justify-content: center;
}
v-btn:
</style>
