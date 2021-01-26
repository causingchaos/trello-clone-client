<template>
  <v-container mt-0>
    <v-progress-circular
      v-if='loadingBoard || loadingLists'
      :width="7" :size="50"
      color="primary"
      indeterminate
      ></v-progress-circular>
    <div class="d-flex">
      <h2 v-if="board">{{board.name}}</h2>
      <pre>{{cards}}</pre>
    </div>
    <div class="d-flex mb-4 flex-wrap" v-if="!loadingLists">
      <v-card class="ma-2" v-for="list in lists" :key="list.id">
        <v-card-title>{{list.name}}</v-card-title>
        <v-card-actions>
          <create-card
            :listId="list.id"
            :boardId="$route.params.id"
          ></create-card>
        </v-card-actions>
      </v-card>
    </div>
    <div class="d-flex">
      <v-card elevation="3">
        <v-card-title>Create List</v-card-title>
          <v-card-actions>
            <v-card-text>
              <v-form v-model="validList" @submit.prevent="createList" @keydown.prevent.enter
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
    </div>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import CreateCard from './CreateCard.vue';

export default {
  components: { CreateCard },
  name: 'board',
  data: () => ({
    validList: false,
    board: {},
    list: {
      name: '',
      order: 0,
      archived: false,
    },
    notEmptyRules: [(value) => !!value || 'Cannot be empty'],
  }),
  mounted() {
    this.getBoard(this.$route.params.id) // id of the current page were on, i.e. boards/2
      .then((response) => {
        this.board = response.data || response;
      });
    this.list.boardId = this.$route.params.id;
    this.findLists({
      query: {
        boardId: this.$route.params.id,
      },
    }).then((response) => {
      console.log('calling findLists query', response);
    });
    this.findCards({
      query: {
        boardId: this.$route.params.id,
      },
    }).then((response) => {
      console.log('calling findCards query', response);
    });
  },
  methods: {
    ...mapActions('boards', { getBoard: 'get' }),
    ...mapActions('lists', { findLists: 'find' }),
    ...mapActions('cards', { findCards: 'find' }),
    createList() {
      if (this.validList) {
        const list = new this.$FeathersVuex.api.List(this.list);
        list.boardId = this.$route.params.id;
        list.save();
        this.list = { // overwrite fields
          name: '',
          order: 0,
          archived: false,
        };
      }
    },
  },
  computed: {
    ...mapState('boards', {
      loadingBoard: 'isGetPending',
    }),
    ...mapState('lists', {
      creatingList: 'isCreatePending',
      loadingLists: 'isFindPending',
    }),
    ...mapGetters('lists', { findListsInStore: 'find' }),
    ...mapGetters('cards', { findCardsInStore: 'find' }),
    lists() {
      // return this.getBoardInStore({ query: {} }).data;
      return this.findListsInStore({
        boardId: this.$route.params.id,
      }).data;
    },
    cards() {
      // return this.getBoardInStore({ query: {} }).data;
      return this.findCardsInStore({
        boardId: this.$route.params.id,
      }).data;
    },
  },
};
</script>
