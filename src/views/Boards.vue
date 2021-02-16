<template>
  <v-container fluid class="default-container">
    <v-row class="ml-0 mb-0">
      <h2>My Boards</h2>
    </v-row>
    <v-row class="pl-0"><!-- Todo ADD skeleton loader here -->
      <v-col v-if='loading' class="col-8">
        <v-progress-circular
          :width="7" :size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </v-col>
      <v-col v-if="!loading" class="col-8">
        <board-list
          :boards="boards"
        ></board-list>
      </v-col>
      <v-col class="col-4">
        <new-board-form
          :creatingBoard="creatingBoard"
          :createBoard="createBoard"
        ></new-board-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import BoardList from '../components/BoardList.vue';
import NewBoardForm from '../components/NewBoardForm.vue';

export default {
  name: 'boards',
  components: {
    BoardList,
    NewBoardForm,
  },
  data: () => ({
    creatingBoard: false,
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
    async createBoard(board) {
      const newBoard = new this.$FeathersVuex.api.Board(board);
      this.creatingBoard = true;
      await newBoard.save();
      setTimeout(() => {
        this.creatingBoard = false;
      }, 300);
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
