<template>
  <v-container class="d-flex flex-wrap">
    <v-card class="ma-1" width="200"
      v-for="board in boards" :key="board._id"
    >
      <v-img height="200px" :src="board.background"></v-img>
      <v-card-title>{{board.name}}</v-card-title>
      <v-card-actions>
        <v-btn color="primary" :to="{ name: 'board', params: { id: board.id }}">Go</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  props: ['boards'],
};
</script>
