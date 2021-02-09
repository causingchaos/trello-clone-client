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

export default {
  name: 'create-card',
  props: ['listId', 'boardId', 'createActivity', 'user'],
  data: () => ({
    validCard: false,
    creatingCard: false,
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
    async createCard() {
      if (this.validCard) {
        this.card.listId = this.listId;
        this.card.boardId = this.boardId;
        const card = new this.$FeathersVuex.api.Card(this.card);
        this.creatingCard = true;
        await card.save()
          .then(() => console.log('card created'))
          .catch((e) => console.log('there has been an error', e));
        // Temp timeout to see functionality
        setTimeout(() => {
          this.creatingCard = false;
        }, 300);
        this.createActivity(`**${this.user.displayName}** created card **${card.title}**`);
        this.card = { // overwrite fields
          title: '',
          memberIds: {},
          order: 0,
        };
      }
    },
  },
};
</script>
