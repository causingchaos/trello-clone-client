<template>
  <v-container>
    <v-progress-circular
      v-if='loading'
      :width="7" :size="50"
      color="primary"
      indeterminate
      ></v-progress-circular>
    <div class="d-flex mb-4 justify-space-around flex-wrap" v-if="!loading">
      <v-card width="300" class="ma-2" v-for="board in boards" :key="board._id">
        <v-img height="200px" :src="board.background"></v-img>
        <v-card-title>{{board.name}}</v-card-title>
        <v-card-actions>
          <v-btn color="primary" :to="{ name: 'board', params: { id: board.id }}">Go</v-btn>
        </v-card-actions>
      </v-card>
    </div>
    <div class="d-flex">
      <v-card elevation="3">
        <v-card-title>Create Board</v-card-title>
          <v-card-actions>
            <v-card-text>
              <v-form v-model="valid" @submit.prevent="createBoard" @keydown.prevent.enter
                v-if="!creating"
              >
                <v-text-field
                  v-model="board.name"
                  :rules="notEmptyRules"
                  label="Name"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="board.background"
                  :rules="notEmptyRules"
                  label="Background"
                  required
                ></v-text-field>
                <v-btn type="submit" :disabled="!valid" color="primary">Create</v-btn>
              </v-form>
              <v-progress-circular
                v-if='creating'
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

export default {
  name: 'boards',
  data: () => ({
    valid: false,
    board: {
      name: '',
      background: '',
    },
    notEmptyRules: [(value) => !!value || 'Cannot be empty'],
  }),
  mounted() {
    this.findBoards({ query: {} });
    // UNSAFE, can access data of other users ??? ERROR
    this.getUser(1).then((result) => {
      console.log('DEBUG Security issue (boards.vue) -- can currently access other users data if logged in');
      console.log('displaying user with id 1');
      console.log(result);
    });
  },
  methods: {
    ...mapActions('auth', ['authenticate']),
    ...mapActions('boards', { findBoards: 'find' }),
    ...mapActions('users', { getUser: 'get' }),
    createBoard() {
      if (this.valid) {
        const board = new this.$FeathersVuex.api.Board(this.board);
        board.save();
        this.board.name = '';
        this.board.background = '';
      }
    },
  },
  computed: {
    ...mapState('auth', { user: 'payload' }),
    ...mapState('boards', {
      loading: 'isFindPending',
      creating: 'isCreatePending',
    }),
    ...mapGetters('boards', { findBoardsInStore: 'find' }),
    boards() {
      return this.findBoardsInStore({
        query: {
          ownerId: this.user.user.id,
        },
      }).data;
    },
  },
};
</script>
