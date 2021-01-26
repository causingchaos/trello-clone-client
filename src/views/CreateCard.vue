<template>
<div class="d-flex">
  <v-card elevation="3">
    <v-card-title>Create Card</v-card-title>
      <v-card-actions>
        <v-card-text>
          <v-form v-model="validCard" @submit.prevent="createCard"
            @keydown.prevent.enter
            v-if="!creatingCard"
          >
            <v-text-field
              v-model="card.title"
              :rules="notEmptyRules"
              label="Title"
              required
            ></v-text-field>
            <v-btn type="submit" :disabled="!validCard" color="primary"
            >Create Card</v-btn>
          </v-form>
          <v-progress-circular
            v-if='creatingCard'
            :width="7" :size="50"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </v-card-text>
      </v-card-actions>
  </v-card>
</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'create-card',
  props: ['listId', 'boardId'],
  data: () => ({
    validCard: false,
    card: {
      title: '',
      // description: '',
      order: 0,
      // archived: false,
      memberIds: {},
      // listId: '', Passed down from parent (prop)
      // boardId: '', Passed down from parent (prop)
    },
    notEmptyRules: [(value) => !!value || 'Cannot be empty'],
  }),
  methods: {
    createCard() {
      if (this.validCard) {
        this.card.listId = this.listId;
        this.card.boardId = this.boardId;
        const card = new this.$FeathersVuex.api.Card(this.card);
        card.save();
        this.card = { // overwrite fields
          title: '',
          membersIds: {},
          order: 0,
        };
      }
    },
  },
  computed: {
    ...mapState('cards', {
      creatingCard: 'isCreatePending',
    }),
  },
};
</script>
