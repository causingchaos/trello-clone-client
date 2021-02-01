<template>
  <v-container fluid class="default-container">
    <v-row class="ml-0 mb-0">
      <h2>My Boards</h2>
    </v-row>
    <v-row class="pl-0">
      <v-col v-if='loading' class="col-9">
        <v-progress-circular
          :width="7" :size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </v-col>
      <v-col v-if="!loading" class="col-9 d-flex flex-wrap">
        <v-card width="200" class="ma-1" v-for="board in boards" :key="board._id">
          <v-img height="200px" :src="board.background"></v-img>
          <v-card-title>{{board.name}}</v-card-title>
          <v-card-actions>
            <v-btn color="primary" :to="{ name: 'board', params: { id: board.id }}">Go</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col class="col-3">
        <v-card elevation="3" class="create-col">
          <v-card-title>Create Board</v-card-title>
          <v-card-actions>
            <v-form v-model="valid" @submit.prevent="createBoard" @keydown.prevent.enter
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
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.create-col{
  min-width: 200px;
}
</style>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';

export default {
  name: 'boards',
  data: () => ({
    creatingBoard: false,
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
    async createBoard() {
      if (this.valid) {
        const board = new this.$FeathersVuex.api.Board(this.board);
        this.creatingBoard = true;
        await board.save();
        setTimeout(() => {
          this.creatingBoard = false;
        }, 300);
        this.board.name = '';
        this.board.background = '';
      }
    },
  },
  computed: {
    ...mapState('auth', { user: 'payload' }),
    ...mapState('boards', {
      loading: 'isFindPending',
      creating: 'isCreatePending', // not used anymore, made spinners slower instead
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
