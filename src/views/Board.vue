<template>
  <v-container mt-3>
    <v-progress-circular
      v-if='loading'
      :width="7" :size="50"
      color="primary"
      indeterminate
      ></v-progress-circular>
   <h2 v-if="board">{{board.name}}</h2>
    <div class="d-flex mb-4 justify-space-around flex-wrap" v-if="!loading">
      <v-card width="300" class="ma-2" v-for="list in lists" :key="list">
        <v-card-title>{{list.name}}</v-card-title>
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
import { mapActions, mapState } from 'vuex';

export default {
  name: 'board',
  data: () => ({
    validList: false,
    board: {},
    list: {
      name: '',
    },
    notEmptyRules: [(value) => !!value || 'Cannot be empty'],
  }),
  mounted() {
    console.log(this.$route.params.id);
    this.getBoard(this.$route.params.id) // id of the current page were on, i.e. boards/2
      .then((response) => {
        this.board = response.data || response;
      });
  },
  methods: {
    ...mapActions('boards', { getBoard: 'get' }),
    createList() {
      if (this.valid) {
        const list = new this.$FeathersVuex.api.Boards(this.list);
        list.save();
        this.list.name = '';
      }
    },
  },
  computed: {
    ...mapState('boards', {
      loading: 'isGetPending',
    }),
    /*
    ...mapGetters('boards', { getBoardInStore: 'get' }),
    board() {
      // return this.getBoardInStore({ query: {} }).data;
      return this.getBoardInStore(this.$route.params.id).data;
    },
    */
  },
};
</script>
