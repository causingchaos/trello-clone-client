<template>
  <v-container>
    <v-card elevation="3" class="create-col">
      <v-card-title>Create Board</v-card-title>
      <v-card-actions>
        <v-form v-model="valid" @submit.prevent="onCreateBoard" @keydown.prevent.enter
          v-if="!creatingBoard"
        >
          <v-text-field class="pa-2"
            dense
            outlined
            v-model="board.name"
            :rules="notEmptyRules"
            label="Name"
            required
          ></v-text-field>
          <v-text-field class="pa-2"
            dense
            outlined
            v-model="board.background"
            :rules="notEmptyRules"
            label="Background"
            required
          ></v-text-field>
          <v-btn class="mb-2" type="submit" :disabled="!valid"
            small
            color="primary"
          >Create</v-btn>
        </v-form>
          <v-progress-circular
            v-if='creatingBoard'
            :width="7" :size="50"
            color="primary"
            indeterminate
          ></v-progress-circular>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style scoped>
.create-col{
  min-width: 200px;
}
</style>

<script>
import { notEmptyRules } from '../formValidators';

export default {
  props: ['creatingBoard', 'createBoard'],
  data: () => ({
    valid: false,
    board: {
      name: '',
      background: '',
    },
    notEmptyRules,
  }),
  methods: {
    async onCreateBoard() {
      if (this.valid) {
        await this.createBoard(this.board);
        this.board.name = '';
        this.board.background = '';
      }
    },
  },
};
</script>
