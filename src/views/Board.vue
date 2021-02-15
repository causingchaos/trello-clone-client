<template>
  <v-container fluid class="default-container">
    <v-row class="bg-green">
      <h2 v-if="board">{{board.name}}</h2>
      <v-col class="col-12">
        <v-alert v-if="cardsError" dismissible type="error"
        >{{cardsError.message}}
        </v-alert>
        <v-alert v-if="boardsError" dismissible type="error"
        >{{boardsError.message}}
        </v-alert>
        <v-alert v-if="listsError" dismissible type="error"
        >{{listsError.message}}
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if='loadingBoard || loadingLists' class="col-8">
        <v-progress-circular
          :width="7" :size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </v-col>
      <v-col class="col-8 d-flex flex-wrap bg-yellow" v-if='!loadingBoard && !loadingLists'>
        <v-card  class="ma-1" width="250"
          v-for="list in lists" :key="list.id"
          @dragover="onSetDroppingList($event, list)"
          :class="{ 'green lighten-4': droppingList == list}"
        >
          <v-row no-gutters class="d-flex flex-column">
            <v-col>
              <v-card-title>{{list.name}}</v-card-title>
            </v-col>
            <v-col v-if="cardsByListId[list.id]">
              <v-card class="ma-3" draggable="true"
                @dragstart="startDraggingCard(card)"
                @dragend="dropCard()"
                dense
                v-bind:key="card.id" v-for="card in cardsByListId[list.id]"
              >
                <v-card-title>
                  {{card.title}}
                </v-card-title>
              </v-card>
            </v-col>
          </v-row>
          <v-card-actions>
            <create-card
              :user="user ? user.user : {}"
              :createActivity="createActivity"
              :listId="list.id"
              :boardId="$route.params.id"
            ></create-card>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col class="col-4 bg-blue">
        <v-row class="mr-1">
          <new-list-form
            :creatingList="creatingList"
            :createList="createList"
          ></new-list-form>
          <Activities
            :activitiesByDate="activitiesByDate"
            :user="user"
          ></Activities>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  mapActions, mapState, mapGetters, mapMutations,
} from 'vuex';

import CreateCard from './CreateCard.vue';
import Activities from '../components/Activities.vue';

import NewListForm from '../components/NewListForm.vue';

export default {
  components: { CreateCard, Activities, NewListForm },
  name: 'board',
  data: () => ({
    // droppingList: null,
    // draggingCard: null,
    board: {},
  }),
  mounted() {
    this.clearActivities(); // Clear the acitivy state on page load
    this.clearLists(); // Clear the lists state on component on page load
    this.getBoard(this.$route.params.id)
      .then((response) => {
        this.board = response.data || response;
      }); // id of the current page were on, i.e. boards/2
    this.findLists({
      query: {
        boardId: this.$route.params.id,
      },
    });
    this.findCards({
      query: {
        boardId: this.$route.params.id,
      },
    });
    this.findActivities({
      query: {
        boardId: this.$route.params.id,
      },
    });
  },
  methods: {
    ...mapMutations('boardStore', ['setDroppingList', 'setDraggingCard']),
    ...mapMutations('lists', { clearLists: 'clearAll' }),
    ...mapMutations('activities', { clearActivities: 'clearAll' }),
    ...mapActions('boards', { getBoard: 'get' }),
    ...mapActions('lists', { findLists: 'find' }),
    ...mapActions('cards', { findCards: 'find' }),
    ...mapActions('activities', { findActivities: 'find' }),
    async createList(list) {
      const newList = new this.$FeathersVuex.api.List(list);
      // list.boardId = this.$route.params.id;
      await newList.save();
      this.createActivity(`**${this.user.user.username}** created list **${newList.name}**`);
    },
    async createActivity(text) {
      const activity = new this.$FeathersVuex.api.Activity();
      activity.text = text;
      activity.boardId = this.$route.params.id;
      await activity.save();
    },
    startDraggingCard(card) {
      this.setDraggingCard(card);
    },
    onSetDroppingList(event, list) {
      // Note you can pass in the raw event dom object in vue by using $event
      this.setDroppingList(list);
      event.preventDefault();
    },
    async dropCard() {
      if (this.droppingList) {
        // do not make activity entry if they drop it on same list
        if (this.draggingCard.listId !== this.droppingList.id) {
          const fromList = this.lists.find((list) => list.id === this.draggingCard.listId);
          const toList = this.lists.find((list) => list.id === this.droppingList.id);
          this.draggingCard.listId = this.droppingList.id;
          await this.draggingCard.save(); // update card on feathers vuex model
          this.createActivity(
            `**${this.user.user.username}**`
            + ` moved card **${this.draggingCard.title}**`
            + ` from **${fromList.name}** to **${toList.name}**`,
          );
        }
      }
      this.setDroppingList(null);
      this.setDraggingCard(null);
    },
  },
  computed: {
    ...mapState('boardStore', ['droppingList', 'draggingCard']),
    ...mapState('boards', {
      loadingBoard: 'isGetPending',
      boardsError: 'errorOnGet',

    }),
    ...mapState('auth', { user: 'payload' }),
    ...mapState('lists', {
      creatingList: 'isCreatePending',
      loadingLists: 'isFindPending',
      listsError: 'errorOnFind',
    }),
    ...mapState('cards', {
      cardsError: 'errorOnFind',
    }),
    ...mapGetters('lists', { findListsInStore: 'find' }),
    ...mapGetters('cards', { findCardsInStore: 'find' }),
    ...mapGetters('activities', { findActivitiesInStore: 'find' }),
    activities() {
      // return this.getBoardInStore({ query: {} }).data;
      return this.findActivitiesInStore({
        boardId: this.$route.params.id,
      }).data;
    },
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
    cardsByListId() {
      // console.log('DEBUG --> Boards.vue - computed -> cardsBylistId');
      // console.log('cards', this.cards);
      const result = this.cards.reduce((byId, card) => {
        const reducer = byId; // to remove linting error
        reducer[card.listId] = byId[card.listId] || [];
        reducer[card.listId].push(card);
        return reducer;
      }, {});
      // console.log(result);
      // console.log('result', result);
      // console.log('DEBUG END --> Boards.vue - computed -> cardsBylistId');
      return result;
    },
    activitiesByDate() {
      return this.activities.slice().reverse();
    },
  },
};
</script>

<style scoped>
.create-col{
  min-width: 200px;
}
.activity-row{
  min-width: 100%;
}
.bg-blue{
  background-color: lightblue;
}
.bg-yellow{
  background-color: lightyellow;
}
.bg-green{
  background-color: lightgreen;
}
</style>
