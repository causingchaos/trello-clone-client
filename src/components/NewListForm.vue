<template>
  <v-card elevation="3" class="ma-2 create-col">
    <v-card-title>Create List</v-card-title>
      <v-card-actions>
        <v-card-text>
          <v-form v-model="validList" @submit.prevent="onCreateList" @keydown.prevent.enter
            v-if="!creatingList"
          >
            <v-text-field
              v-model="list.name"
              :rules="notEmptyRules"
              label="Name"
              required
            ></v-text-field>
            <v-btn type="submit" :disabled="!validList" color="primary">Create List</v-btn>
          </v-form>
          <v-progress-circular
            v-if='creatingList'
            :width="7" :size="50"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </v-card-text>
      </v-card-actions>
  </v-card>
</template>

<script>
import { notEmptyRules } from '../formValidators';

export default {
  props: ['creatingList', 'createList'],
  data: () => ({
    validList: false,
    list: {
      name: '',
      order: 0,
      archived: false,
    },
    notEmptyRules,
  }),
  mounted() {
    this.list.boardId = this.$route.params.id;
  },
  methods: {
    async onCreateList() {
      if (this.validList) {
        await this.createList(this.list);
        this.list = { // Clear fields once saved
          name: '',
          order: 0,
          archived: false,
        };
      }
    },
  },
};
</script>
